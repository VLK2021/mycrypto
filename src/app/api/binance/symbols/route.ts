import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const data = await res.json();

        const symbols = data.symbols
            .filter((s: any) => s.symbol.endsWith("USDT") && s.status === "TRADING")
            .map((s: any) => ({
                label: `${s.baseAsset}/USDT`,
                value: s.baseAsset,
            }));

        return NextResponse.json(symbols);
    } catch (err) {
        console.error("Binance fetch error:", err);
        return NextResponse.json(
            { error: "Failed to fetch symbols" },
            { status: 500 }
        );
    }
}
