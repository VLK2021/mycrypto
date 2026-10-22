import type {
    BinanceExchangeInfoResponse,
    BinanceFuturesFilter,
    BinanceFuturesSymbol,
    BinanceFuturesSymbolRaw,
} from "@/types";


const BINANCE_FUTURES_EXCHANGE_INFO_URL =
    "https://fapi.binance.com/fapi/v1/exchangeInfo";

type BinancePriceFilter =
    BinanceFuturesFilter & {
    minPrice: string;
    maxPrice: string;
    tickSize: string;
};

const isBinancePriceFilter = (
    filter: BinanceFuturesFilter,
): filter is BinancePriceFilter => {
    return (
        filter.filterType ===
        "PRICE_FILTER" &&
        typeof filter.minPrice ===
        "string" &&
        typeof filter.maxPrice ===
        "string" &&
        typeof filter.tickSize ===
        "string"
    );
};

const findPriceFilter = (
    symbol: BinanceFuturesSymbolRaw,
): BinancePriceFilter | null => {
    return (
        symbol.filters.find(
            isBinancePriceFilter,
        ) ?? null
    );
};

const normalizeBinanceSymbol = (
    symbol: BinanceFuturesSymbolRaw,
): BinanceFuturesSymbol | null => {
    const priceFilter =
        findPriceFilter(symbol);

    if (!priceFilter) {
        console.warn(
            `PRICE_FILTER is missing for Binance Futures symbol ${symbol.symbol}`,
        );

        return null;
    }

    return {
        symbol: symbol.symbol,
        baseAsset:
        symbol.baseAsset,
        quoteAsset:
        symbol.quoteAsset,
        pricePrecision:
        symbol.pricePrecision,
        minPrice:
        priceFilter.minPrice,
        maxPrice:
        priceFilter.maxPrice,
        tickSize:
        priceFilter.tickSize,
    };
};

const isTradingFuturesSymbol = (
    symbol: BinanceFuturesSymbolRaw,
): boolean => {
    return (
        symbol.status === "TRADING" &&
        typeof symbol.symbol ===
        "string" &&
        symbol.symbol.trim().length >
        0 &&
        typeof symbol.baseAsset ===
        "string" &&
        typeof symbol.quoteAsset ===
        "string"
    );
};

const removeDuplicateSymbols = (
    symbols: BinanceFuturesSymbol[],
): BinanceFuturesSymbol[] => {
    const uniqueSymbols =
        new Map<
            string,
            BinanceFuturesSymbol
        >();

    symbols.forEach((symbol) => {
        uniqueSymbols.set(
            symbol.symbol,
            symbol,
        );
    });

    return Array.from(
        uniqueSymbols.values(),
    );
};

export const getBinanceFuturesSymbols =
    async (): Promise<
        BinanceFuturesSymbol[]
    > => {
        const response = await fetch(
            BINANCE_FUTURES_EXCHANGE_INFO_URL,
            {
                method: "GET",

                headers: {
                    Accept: "application/json",
                },

                cache: "no-store",
            },
        );

        if (!response.ok) {
            throw new Error(
                `Binance Futures exchange info request failed with status ${response.status}`,
            );
        }

        const data =
            (await response.json()) as BinanceExchangeInfoResponse;

        if (
            !data ||
            !Array.isArray(
                data.symbols,
            )
        ) {
            throw new Error(
                "Binance Futures exchange info response does not contain symbols",
            );
        }

        const normalizedSymbols =
            data.symbols
                .filter(
                    isTradingFuturesSymbol,
                )
                .map(
                    normalizeBinanceSymbol,
                )
                .filter(
                    (
                        symbol,
                    ): symbol is BinanceFuturesSymbol =>
                        symbol !==
                        null,
                );

        return removeDuplicateSymbols(
            normalizedSymbols,
        ).sort(
            (
                firstSymbol,
                secondSymbol,
            ) =>
                firstSymbol.symbol.localeCompare(
                    secondSymbol.symbol,
                    "en",
                    {
                        numeric: true,
                        sensitivity:
                            "base",
                    },
                ),
        );
    };

export const getBinanceFuturesSymbol =
    async (
        symbol: string,
    ): Promise<
        BinanceFuturesSymbol | null
    > => {
        const normalizedSymbol =
            symbol
                .trim()
                .toUpperCase();

        if (!normalizedSymbol) {
            return null;
        }

        const symbols =
            await getBinanceFuturesSymbols();

        return (
            symbols.find(
                (binanceSymbol) =>
                    binanceSymbol.symbol.toUpperCase() ===
                    normalizedSymbol,
            ) ?? null
        );
    };