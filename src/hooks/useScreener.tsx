
"use client";

import { useEffect, useState } from "react";

import type {
    ScreenerCoin,
    ScreenerCandle,
    ScreenerSeed,
} from "@/interfaces/screener";

const BATCH_SIZE = 5;
const SEED_PAUSE = 1_500;
const OI_PAUSE = 10_000;
const OI_CYCLE_PAUSE = 30_000;

const SEED_TTL = 10 * 60_000;
const STORAGE_KEY = "mycrypto_screener_seed_v2";

const WS_BASE = "wss://fstream.binance.com/market";
const STREAMS_PER_SOCKET = 75;

const MAX_RECONNECT_DELAY = 60_000;
const DEFAULT_API_COOLDOWN = 60_000;

type CachedSeed = {
    expiresAt: number;
    seed: ScreenerSeed;
};

type CandleHistory = {
    oneHour: ScreenerCandle[] | null;
    fourHour: ScreenerCandle[] | null;
};

type TickerEvent = {
    s?: string;
    c?: string;
    P?: string;
    q?: string;
};

type FundingEvent = {
    s?: string;
    r?: string;
};

type KlineEvent = {
    e?: string;
    s?: string;
    k?: {
        t: number;
        i: string;
        c: string;
        x: boolean;
    };
};

type StreamEnvelope = {
    data?: unknown;
};

type OIResult = {
    symbol: string;
    openInterest: number | null;
};

class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly retryAfterMs: number | null
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function toNumber(value: unknown): number | null {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
}

function calculateRSI(
    candles: ScreenerCandle[],
    period = 14
): number | null {
    const closes = candles.map((candle) => candle.close);

    if (
        closes.length <= period ||
        closes.some((value) => !Number.isFinite(value))
    ) {
        return null;
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const diff = closes[i] - closes[i - 1];

        gains += Math.max(diff, 0);
        losses += Math.max(-diff, 0);
    }

    let averageGain = gains / period;
    let averageLoss = losses / period;

    for (let i = period + 1; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1];

        averageGain =
            (averageGain * (period - 1) +
                Math.max(diff, 0)) /
            period;

        averageLoss =
            (averageLoss * (period - 1) +
                Math.max(-diff, 0)) /
            period;
    }

    if (averageGain === 0 && averageLoss === 0) {
        return 50;
    }

    if (averageLoss === 0) {
        return 100;
    }

    return 100 - 100 / (1 + averageGain / averageLoss);
}

function readCache(): Record<string, CachedSeed> {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) return {};

        const parsed: unknown = JSON.parse(raw);

        if (
            !parsed ||
            typeof parsed !== "object" ||
            Array.isArray(parsed)
        ) {
            return {};
        }

        return parsed as Record<string, CachedSeed>;
    } catch {
        return {};
    }
}

function writeCache(
    cache: Record<string, CachedSeed>
): void {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cache)
        );
    } catch {
        // Cache is optional.
    }
}

function sleep(
    milliseconds: number,
    signal: AbortSignal
): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(new Error("Aborted"));
            return;
        }

        function onAbort() {
            window.clearTimeout(timer);
            reject(new Error("Aborted"));
        }

        const timer = window.setTimeout(() => {
            signal.removeEventListener("abort", onAbort);
            resolve();
        }, milliseconds);

        signal.addEventListener("abort", onAbort, {
            once: true,
        });
    });
}

function parseRetryAfter(
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

async function getJson<T>(
    url: string,
    signal: AbortSignal
): Promise<T> {
    const response = await fetch(url, {
        signal,
        cache: "no-store",
    });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;

        const payload: unknown = await response
            .json()
            .catch(() => null);

        if (
            payload &&
            typeof payload === "object" &&
            "error" in payload
        ) {
            message = String(payload.error);
        }

        throw new ApiError(
            message,
            response.status,
            parseRetryAfter(
                response.headers.get("Retry-After")
            )
        );
    }

    return (await response.json()) as T;
}

function updateCandle(
    candles: ScreenerCandle[],
    time: number,
    close: number
): void {
    const last = candles[candles.length - 1];

    if (!last) {
        candles.push({ time, close });
        return;
    }

    if (time < last.time) {
        return;
    }

    if (time === last.time) {
        last.close = close;
        return;
    }

    candles.push({ time, close });

    if (candles.length > 100) {
        candles.splice(0, candles.length - 100);
    }
}

export function useScreener() {
    const [data, setData] = useState<ScreenerCoin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        let dirty = false;

        let symbols: string[] = [];
        let apiCooldownUntil = 0;

        let seedBusy = false;
        let seedRefreshRequested = false;

        const controller = new AbortController();

        const coins = new Map<string, ScreenerCoin>();
        const histories = new Map<string, CandleHistory>();
        const seedCache = readCache();

        const sockets = new Set<WebSocket>();
        const timers = new Set<number>();

        function publish(): void {
            if (!active || !dirty) return;

            dirty = false;
            setData([...coins.values()]);
        }

        function markDirty(): void {
            dirty = true;
        }

        function updateCoin(
            symbol: string,
            changes: Partial<ScreenerCoin>
        ): void {
            const previous = coins.get(symbol);

            if (!previous) return;

            coins.set(symbol, {
                ...previous,
                ...changes,
            });

            markDirty();
        }

        function applyCooldown(error: unknown): void {
            if (!(error instanceof ApiError)) return;

            if (![418, 429, 451, 503].includes(error.status)) {
                return;
            }

            const delay = error.retryAfterMs ??
                DEFAULT_API_COOLDOWN;

            apiCooldownUntil = Math.max(
                apiCooldownUntil,
                Date.now() + Math.max(delay, DEFAULT_API_COOLDOWN)
            );

            console.warn(
                "[SCREENER] API cooldown:",
                error.status,
                delay
            );
        }

        async function waitForApi(): Promise<void> {
            const remaining = apiCooldownUntil - Date.now();

            if (remaining > 0) {
                await sleep(remaining, controller.signal);
            }
        }

        function applySeed(seed: ScreenerSeed): void {
            const previous = histories.get(seed.symbol);

            const oneHour = seed.candles1h
                ? seed.candles1h.map((item) => ({ ...item }))
                : previous?.oneHour ?? null;

            const fourHour = seed.candles4h
                ? seed.candles4h.map((item) => ({ ...item }))
                : previous?.fourHour ?? null;

            histories.set(seed.symbol, {
                oneHour,
                fourHour,
            });

            updateCoin(seed.symbol, {
                openInterest:
                    seed.openInterest ??
                    coins.get(seed.symbol)?.openInterest ??
                    null,

                rsi1h: oneHour
                    ? calculateRSI(oneHour)
                    : null,

                rsi4h: fourHour
                    ? calculateRSI(fourHour)
                    : null,
            });
        }

        function handleKline(event: KlineEvent): void {
            if (!event.s || !event.k) return;

            const close = toNumber(event.k.c);

            if (close === null) return;

            const history = histories.get(event.s);

            if (!history) return;

            if (
                event.k.i === "1h" &&
                history.oneHour
            ) {
                updateCandle(
                    history.oneHour,
                    event.k.t,
                    close
                );

                updateCoin(event.s, {
                    rsi1h: calculateRSI(history.oneHour),
                });
            }

            if (
                event.k.i === "4h" &&
                history.fourHour
            ) {
                updateCandle(
                    history.fourHour,
                    event.k.t,
                    close
                );

                updateCoin(event.s, {
                    rsi4h: calculateRSI(history.fourHour),
                });
            }
        }

        function handleTicker(payload: unknown): void {
            if (!Array.isArray(payload)) return;

            for (const item of payload as TickerEvent[]) {
                if (!item.s) continue;

                const previous = coins.get(item.s);

                if (!previous) continue;

                updateCoin(item.s, {
                    price:
                        toNumber(item.c) ?? previous.price,

                    change24h:
                        toNumber(item.P) ??
                        previous.change24h,

                    volume:
                        toNumber(item.q) ?? previous.volume,
                });
            }
        }

        function handleFunding(payload: unknown): void {
            if (!Array.isArray(payload)) return;

            for (const item of payload as FundingEvent[]) {
                if (!item.s) continue;

                const funding = toNumber(item.r);

                if (funding === null) continue;

                updateCoin(item.s, { funding });
            }
        }

        async function loadSeeds(
            force = false
        ): Promise<void> {
            if (seedBusy) {
                if (force) {
                    seedRefreshRequested = true;
                }
                return;
            }

            seedBusy = true;

            try {
                const missing: string[] = [];
                const now = Date.now();

                for (const symbol of symbols) {
                    const cached = seedCache[symbol];

                    if (
                        !force &&
                        cached &&
                        cached.expiresAt > now &&
                        cached.seed
                    ) {
                        applySeed(cached.seed);
                    } else {
                        missing.push(symbol);
                    }
                }

                publish();

                for (
                    let index = 0;
                    index < missing.length;
                    index += BATCH_SIZE
                ) {
                    if (!active || controller.signal.aborted) {
                        return;
                    }

                    await waitForApi();

                    const batch = missing.slice(
                        index,
                        index + BATCH_SIZE
                    );

                    const params = new URLSearchParams({
                        mode: "seed",
                        symbols: batch.join(","),
                    });

                    try {
                        const results = await getJson<ScreenerSeed[]>(
                            `/api/screener?${params.toString()}`,
                            controller.signal
                        );

                        if (!Array.isArray(results)) {
                            throw new Error(
                                "Invalid seed response"
                            );
                        }

                        for (const seed of results) {
                            if (!coins.has(seed.symbol)) {
                                continue;
                            }

                            applySeed(seed);

                            if (
                                seed.candles1h &&
                                seed.candles4h
                            ) {
                                seedCache[seed.symbol] = {
                                    seed,
                                    expiresAt:
                                        Date.now() + SEED_TTL,
                                };
                            }
                        }

                        writeCache(seedCache);
                        publish();
                    } catch (error) {
                        if (!active) return;

                        applyCooldown(error);

                        console.error(
                            "[SCREENER SEED]",
                            error
                        );

                        // Stop this scan on failure;
                        // don't hammer the API.
                        return;
                    }

                    if (
                        index + BATCH_SIZE <
                        missing.length
                    ) {
                        await sleep(
                            SEED_PAUSE,
                            controller.signal
                        );
                    }
                }
            } finally {
                seedBusy = false;

                if (
                    active &&
                    seedRefreshRequested &&
                    !controller.signal.aborted
                ) {
                    seedRefreshRequested = false;

                    void loadSeeds(true).catch(
                        console.error
                    );
                }
            }
        }

        async function refreshOI(): Promise<void> {
            for (
                let index = 0;
                index < symbols.length;
                index += BATCH_SIZE
            ) {
                if (!active || controller.signal.aborted) {
                    return;
                }

                await waitForApi();

                const batch = symbols.slice(
                    index,
                    index + BATCH_SIZE
                );

                const params = new URLSearchParams({
                    mode: "oi",
                    symbols: batch.join(","),
                });

                try {
                    const results = await getJson<OIResult[]>(
                        `/api/screener?${params.toString()}`,
                        controller.signal
                    );

                    if (!Array.isArray(results)) {
                        throw new Error(
                            "Invalid OI response"
                        );
                    }

                    for (const result of results) {
                        if (result.openInterest !== null) {
                            updateCoin(result.symbol, {
                                openInterest: result.openInterest,
                            });
                        }
                    }
                } catch (error) {
                    if (!active) return;

                    applyCooldown(error);

                    console.error(
                        "[SCREENER OI]",
                        error
                    );

                    return;
                }

                await sleep(
                    OI_PAUSE,
                    controller.signal
                );
            }
        }

        function connect(
            url: string,
            handler: (payload: unknown) => void,
            resyncOnReconnect = false
        ): void {
            let attempts = 0;
            let successfullyConnected = false;

            function open(): void {
                if (!active) return;

                const socket = new WebSocket(url);
                sockets.add(socket);

                socket.onopen = () => {
                    if (!active) return;

                    if (
                        successfullyConnected &&
                        resyncOnReconnect
                    ) {
                        // A connection was lost. Refresh
                        // candle history to fill gaps.
                        void loadSeeds(true).catch(
                            console.error
                        );
                    }

                    successfullyConnected = true;
                    attempts = 0;
                };

                socket.onmessage = (event: MessageEvent) => {
                    if (!active) return;

                    try {
                        const message: unknown = JSON.parse(
                            String(event.data)
                        );

                        if (
                            message &&
                            typeof message === "object" &&
                            "data" in message
                        ) {
                            handler(
                                (message as StreamEnvelope).data
                            );
                        } else {
                            handler(message);
                        }
                    } catch {
                        // Ignore invalid messages.
                    }
                };

                socket.onerror = () => {
                    // Reconnect is handled by onclose.
                };

                socket.onclose = () => {
                    sockets.delete(socket);

                    if (!active) return;

                    attempts++;

                    const delay = Math.min(
                        MAX_RECONNECT_DELAY,
                        1000 * 2 ** Math.min(attempts, 6)
                    );

                    const jitter =
                        Math.floor(Math.random() * 1000);

                    const timer = window.setTimeout(() => {
                        timers.delete(timer);
                        open();
                    }, delay + jitter);

                    timers.add(timer);
                };
            }

            open();
        }

        function startStreams(): void {
            connect(
                `${WS_BASE}/ws/!ticker@arr`,
                handleTicker
            );

            connect(
                `${WS_BASE}/ws/!markPrice@arr@1s`,
                handleFunding
            );

            const streams = symbols.flatMap((symbol) => {
                const lower = symbol.toLowerCase();

                return [
                    `${lower}@kline_1h`,
                    `${lower}@kline_4h`,
                ];
            });

            for (
                let index = 0;
                index < streams.length;
                index += STREAMS_PER_SOCKET
            ) {
                const group = streams.slice(
                    index,
                    index + STREAMS_PER_SOCKET
                );

                const url =
                    `${WS_BASE}/stream?streams=` +
                    group.join("/");

                connect(
                    url,
                    (payload) => {
                        if (
                            payload &&
                            typeof payload === "object" &&
                            "e" in payload
                        ) {
                            handleKline(payload as KlineEvent);
                        }
                    },
                    true
                );
            }
        }

        async function run(): Promise<void> {
            try {
                await waitForApi();

                const base = await getJson<ScreenerCoin[]>(
                    "/api/screener",
                    controller.signal
                );

                if (!Array.isArray(base)) {
                    throw new Error(
                        "Invalid screener response"
                    );
                }

                for (const coin of base) {
                    coins.set(coin.symbol, coin);
                }

                symbols = base.map((coin) => coin.symbol);

                markDirty();
                publish();

                if (active) {
                    setLoading(false);
                }

                startStreams();

                await loadSeeds();

                // Initial seed already includes OI.
                // Begin the separate OI cycle afterward.
                while (
                    active &&
                    !controller.signal.aborted
                    ) {
                    await refreshOI();

                    if (!active) break;

                    await sleep(
                        OI_CYCLE_PAUSE,
                        controller.signal
                    );
                }
            } catch (error) {
                if (!active || controller.signal.aborted) {
                    return;
                }

                applyCooldown(error);

                console.error(
                    "[SCREENER]",
                    error
                );

                setLoading(false);
            }
        }

        const renderInterval = window.setInterval(
            publish,
            1000
        );

        void run();

        return () => {
            active = false;

            controller.abort();

            window.clearInterval(renderInterval);

            for (const timer of timers) {
                window.clearTimeout(timer);
            }

            timers.clear();

            for (const socket of sockets) {
                socket.onopen = null;
                socket.onmessage = null;
                socket.onerror = null;
                socket.onclose = null;

                if (
                    socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING
                ) {
                    socket.close();
                }
            }

            sockets.clear();
        };
    }, []);

    return {
        data,
        loading,
    };
}
