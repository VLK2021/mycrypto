
import { NextRequest, NextResponse } from "next/server";

import type {
    ScreenerCoin,
    ScreenerCandle,
    ScreenerSeed,
} from "@/interfaces/screener";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = "https://fapi.binance.com";

const TOP_LIMIT = 150;
const MAX_BATCH = 5;
const CONCURRENCY = 2;

// Minimum spacing between Binance requests
// started by this server instance.
const REQUEST_SPACING = 200;

// Default cooldown if Binance does not
// provide a Retry-After header.
const RATE_LIMIT_COOLDOWN = 60_000;
const BAN_COOLDOWN = 120_000;

type ExchangeSymbol = {
    symbol: string;
    status: string;
    contractType: string;
    quoteAsset: string;
};

type ExchangeInfo = {
    symbols: ExchangeSymbol[];
};

type Ticker = {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
    quoteVolume: string;
};

type Premium = {
    symbol: string;
    lastFundingRate: string;
};

type OpenInterest = {
    openInterest: string;
};

type Kline = [
    number,
    string,
    string,
    string,
    string,
    ...unknown[]
];

type OIResult = {
    symbol: string;
    openInterest: number | null;
};

class BinanceError extends Error {
    constructor(
        readonly status: number,
        readonly retryAfter: string | null,
        message: string
    ) {
        super(message);
        this.name = "BinanceError";
    }
}

// This state is shared only inside one
// running Node.js server instance.
let cooldownUntil = 0;
let nextRequestAt = 0;

// Serializes the start of outgoing requests.
let requestQueue: Promise<void> = Promise.resolve();

function num(value: unknown): number | null {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const result = Number(value);

    return Number.isFinite(result) ? result : null;
}

function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function getRetryAfterMs(
    value: string | null
): number | null {
    if (!value) return null;

    const seconds = Number(value);

    if (Number.isFinite(seconds)) {
        return Math.max(0, seconds * 1000);
    }

    const date = Date.parse(value);

    if (Number.isFinite(date)) {
        return Math.max(0, date - Date.now());
    }

    return null;
}

function setCooldown(
    status: number,
    retryAfter: string | null
): void {
    if (![418, 429].includes(status)) {
        return;
    }

    const fallback =
        status === 418
            ? BAN_COOLDOWN
            : RATE_LIMIT_COOLDOWN;

    const delay = getRetryAfterMs(retryAfter) ?? fallback;

    cooldownUntil = Math.max(
        cooldownUntil,
        Date.now() + delay
    );

    console.warn("[SCREENER] Binance cooldown", {
        status,
        delay,
    });
}

function checkCooldown(): void {
    const remaining = cooldownUntil - Date.now();

    if (remaining <= 0) return;

    throw new BinanceError(
        429,
        String(Math.ceil(remaining / 1000)),
        "Binance request cooldown is active"
    );
}

async function scheduleRequest(): Promise<void> {
    const scheduled = requestQueue.then(async () => {
        checkCooldown();

        const delay = Math.max(
            0,
            nextRequestAt - Date.now()
        );

        if (delay > 0) {
            await sleep(delay);
        }

        checkCooldown();

        nextRequestAt =
            Date.now() + REQUEST_SPACING;
    });

    // Keep the queue usable even if one
    // request is rejected.
    requestQueue = scheduled.catch(() => undefined);

    await scheduled;
}

async function binance<T>(
    path: string,
    revalidate: number
): Promise<T> {
    await scheduleRequest();

    const response = await fetch(`${API}${path}`, {
        next: {
            revalidate,
        },
        signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
        const body = await response
            .text()
            .catch(() => "");

        const retryAfter =
            response.headers.get("Retry-After");

        setCooldown(
            response.status,
            retryAfter
        );

        throw new BinanceError(
            response.status,
            retryAfter,
            `Binance HTTP ${response.status}: ${body.slice(0, 200)}`
        );
    }

    return (await response.json()) as T;
}

async function getValidSymbols(): Promise<Set<string>> {
    const info = await binance<ExchangeInfo>(
        "/fapi/v1/exchangeInfo",
        3600
    );

    if (!Array.isArray(info?.symbols)) {
        throw new Error("Invalid Binance exchangeInfo");
    }

    return new Set(
        info.symbols
            .filter(
                (item) =>
                    item.status === "TRADING" &&
                    item.contractType === "PERPETUAL" &&
                    item.quoteAsset === "USDT"
            )
            .map((item) => item.symbol)
    );
}

async function getBase(): Promise<ScreenerCoin[]> {
    const [valid, tickers, premiums] =
        await Promise.all([
            getValidSymbols(),

            binance<Ticker[]>(
                "/fapi/v1/ticker/24hr",
                30
            ),

            binance<Premium[]>(
                "/fapi/v1/premiumIndex",
                30
            ),
        ]);

    if (
        !Array.isArray(tickers) ||
        !Array.isArray(premiums)
    ) {
        throw new Error(
            "Invalid Binance market response"
        );
    }

    const funding = new Map<string, number | null>(
        premiums.map((item) => [
            item.symbol,
            num(item.lastFundingRate),
        ])
    );

    return tickers
        .filter((item) => valid.has(item.symbol))
        .sort(
            (a, b) =>
                Number(b.quoteVolume) -
                Number(a.quoteVolume)
        )
        .slice(0, TOP_LIMIT)
        .map((item) => ({
            symbol: item.symbol,
            price: num(item.lastPrice),
            change24h: num(item.priceChangePercent),
            volume: num(item.quoteVolume),
            funding:
                funding.get(item.symbol) ?? null,
            openInterest: null,
            rsi1h: null,
            rsi4h: null,
        }));
}

async function getCandles(
    symbol: string,
    interval: "1h" | "4h"
): Promise<ScreenerCandle[] | null> {
    const candles = await binance<Kline[]>(
        `/fapi/v1/klines?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=100`,
        interval === "1h" ? 60 : 60
    );

    if (!Array.isArray(candles)) {
        throw new Error(
            `Invalid ${interval} candles: ${symbol}`
        );
    }

    // A newly listed coin may genuinely
    // have insufficient candle history.
    if (candles.length < 16) {
        return null;
    }

    const result = candles.map((item) => ({
        time: Number(item[0]),
        close: Number(item[4]),
    }));

    if (
        result.some(
            (item) =>
                !Number.isFinite(item.time) ||
                !Number.isFinite(item.close)
        )
    ) {
        throw new Error(
            `Invalid candle values: ${symbol} ${interval}`
        );
    }

    return result;
}

async function getOI(
    symbol: string
): Promise<number | null> {
    const result = await binance<OpenInterest>(
        `/fapi/v1/openInterest?symbol=${encodeURIComponent(symbol)}`,
        30
    );

    return num(result.openInterest);
}

async function getSeed(
    symbol: string
): Promise<ScreenerSeed> {
    const [candles1h, candles4h, openInterest] =
        await Promise.all([
            getCandles(symbol, "1h"),
            getCandles(symbol, "4h"),
            getOI(symbol),
        ]);

    return {
        symbol,
        candles1h,
        candles4h,
        openInterest,
    };
}

async function processBatch<T>(
    symbols: string[],
    operation: (symbol: string) => Promise<T>
): Promise<T[]> {
    const results: T[] = new Array(symbols.length);

    let cursor = 0;
    let firstError: unknown = null;

    async function worker(): Promise<void> {
        while (
            cursor < symbols.length &&
            firstError === null
            ) {
            const index = cursor++;
            const symbol = symbols[index];

            try {
                results[index] = await operation(symbol);
            } catch (error) {
                firstError = error;
            }
        }
    }

    await Promise.all(
        Array.from(
            {
                length: Math.min(
                    CONCURRENCY,
                    symbols.length
                ),
            },
            () => worker()
        )
    );

    if (firstError !== null) {
        throw firstError;
    }

    return results;
}

function errorResponse(error: unknown) {
    console.error("[SCREENER API]", error);

    if (error instanceof BinanceError) {
        const headers: Record<string, string> = {
            "Cache-Control": "no-store",
        };

        if (error.retryAfter) {
            headers["Retry-After"] =
                error.retryAfter;
        } else if (error.status === 429) {
            headers["Retry-After"] = String(
                Math.ceil(RATE_LIMIT_COOLDOWN / 1000)
            );
        } else if (error.status === 418) {
            headers["Retry-After"] = String(
                Math.ceil(BAN_COOLDOWN / 1000)
            );
        }

        const status =
            [403, 418, 429, 451].includes(error.status)
                ? error.status
                : 503;

        return NextResponse.json(
            {
                error: error.message,
                upstreamStatus: error.status,
            },
            {
                status,
                headers,
            }
        );
    }

    return NextResponse.json(
        {
            error:
                error instanceof Error
                    ? error.message
                    : "Screener unavailable",
        },
        {
            status: 503,
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}

export async function GET(request: NextRequest) {
    try {
        checkCooldown();

        const params = request.nextUrl.searchParams;
        const mode = params.get("mode");

        // Basic top-150 screener data.
        if (mode === null) {
            const base = await getBase();

            return NextResponse.json(base, {
                headers: {
                    "Cache-Control": "no-store",
                },
            });
        }

        if (mode !== "seed" && mode !== "oi") {
            return NextResponse.json(
                { error: "Invalid screener mode" },
                { status: 400 }
            );
        }

        const raw = params.get("symbols") ?? "";

        const symbols = [
            ...new Set(
                raw.split(",")
                    .map((symbol) =>
                        symbol.trim().toUpperCase()
                    )
                    .filter(Boolean)
            ),
        ];

        if (
            symbols.length === 0 ||
            symbols.length > MAX_BATCH
        ) {
            return NextResponse.json(
                { error: "Invalid batch size" },
                { status: 400 }
            );
        }

        // Validate against real Binance symbols,
        // not an invented regular expression.
        const valid = await getValidSymbols();

        const invalid = symbols.filter(
            (symbol) => !valid.has(symbol)
        );

        if (invalid.length > 0) {
            return NextResponse.json(
                {
                    error: "Unknown trading symbols",
                    symbols: invalid,
                },
                { status: 400 }
            );
        }

        if (mode === "seed") {
            const data = await processBatch(
                symbols,
                getSeed
            );

            return NextResponse.json(data, {
                headers: {
                    "Cache-Control": "no-store",
                },
            });
        }

        const data: OIResult[] = await processBatch(
            symbols,
            async (symbol): Promise<OIResult> => ({
                symbol,
                openInterest: await getOI(symbol),
            })
        );

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        return errorResponse(error);
    }
}
