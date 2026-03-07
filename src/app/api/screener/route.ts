import { NextResponse } from "next/server";

export async function GET() {
    try {

        const [exchangeRes, tickerRes, premiumRes] = await Promise.all([
            fetch("https://fapi.binance.com/fapi/v1/exchangeInfo"),
            fetch("https://fapi.binance.com/fapi/v1/ticker/24hr"),
            fetch("https://fapi.binance.com/fapi/v1/premiumIndex")
        ]);

        const exchange = await exchangeRes.json();
        const ticker = await tickerRes.json();
        const premium = await premiumRes.json();

        const premiumMap = new Map();

        for (const p of premium) {
            premiumMap.set(p.symbol, {
                funding: Number(p.lastFundingRate),
                openInterest: Number(p.openInterest)
            });
        }

        const validSymbols = new Set(
            exchange.symbols
                .filter((s: any) =>
                    s.contractType === "PERPETUAL" &&
                    s.status === "TRADING" &&
                    s.quoteAsset === "USDT"
                )
                .map((s: any) => s.symbol)
        );

        const screener = ticker
            .filter((t: any) => validSymbols.has(t.symbol))
            .map((t: any) => {

                const premiumData = premiumMap.get(t.symbol) || {};

                return {
                    symbol: t.symbol,
                    price: Number(t.lastPrice),
                    change24h: Number(t.priceChangePercent),
                    volume: Number(t.quoteVolume),
                    openInterest: premiumData.openInterest ?? 0,
                    funding: premiumData.funding ?? 0
                };

            })
            .sort((a: any, b: any) => b.volume - a.volume)
            .slice(0, 150);

        return NextResponse.json(screener);

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            { error: "Failed to load screener" },
            { status: 500 }
        );

    }
}
