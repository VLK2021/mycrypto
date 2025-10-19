import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const data = await res.json();

        const symbols = data.symbols
            .filter((s: any) => s.quoteAsset === "USDT") // тільки USDT пари
            .map((s: any) => ({
                label: s.baseAsset,
                value: s.baseAsset,
                icon: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${s.baseAsset.toLowerCase()}.png`,
            }));

        return NextResponse.json(symbols);
    } catch (error) {
        console.error("Error fetching symbols:", error);
        return NextResponse.json({ error: "Failed to fetch symbols" }, { status: 500 });
    }
}
