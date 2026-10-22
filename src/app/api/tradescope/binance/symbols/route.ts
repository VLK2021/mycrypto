import {
    NextResponse,
} from "next/server";

import {
    getBinanceFuturesSymbols,
} from "@/services/binance.service";

type FuturesSymbolOption = {
    value: string;
    label: string;
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    pricePrecision: number;
    minPrice: string;
    maxPrice: string;
    tickSize: string;
};

type BinanceSymbolsErrorResponse = {
    message: string;
};

export const dynamic =
    "force-dynamic";

export const revalidate = 0;

export async function GET(): Promise<
    NextResponse<
        | FuturesSymbolOption[]
        | BinanceSymbolsErrorResponse
    >
> {
    try {
        const symbols =
            await getBinanceFuturesSymbols();

        const options =
            symbols.map(
                (
                    symbol,
                ): FuturesSymbolOption => ({
                    value:
                    symbol.symbol,
                    label:
                    symbol.symbol,
                    symbol:
                    symbol.symbol,
                    baseAsset:
                    symbol.baseAsset,
                    quoteAsset:
                    symbol.quoteAsset,
                    pricePrecision:
                    symbol.pricePrecision,
                    minPrice:
                    symbol.minPrice,
                    maxPrice:
                    symbol.maxPrice,
                    tickSize:
                    symbol.tickSize,
                }),
            );

        return NextResponse.json(
            options,
            {
                status: 200,

                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate",
                },
            },
        );
    } catch (error) {
        console.error(
            "Failed to load Binance Futures symbols:",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "Не вдалося завантажити список Binance Futures.",
            },
            {
                status: 500,
            },
        );
    }
}