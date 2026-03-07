import { NextResponse } from "next/server";

function calculateRSI(closes: number[], period = 14) {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const diff = closes[i] - closes[i - 1];

        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;

    return 100 - 100 / (1 + rs);
}

async function getRSI(symbol: string, interval: string) {
    try {

        const res = await fetch(
            `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=100`
        );

        const data = await res.json();

        const closes = data.map((k: any) => Number(k[4]));

        return calculateRSI(closes.slice(-15));

    } catch {
        return 0;
    }
}

export async function GET() {
    try {

        const [exchangeRes, tickerRes, fundingRes] = await Promise.all([
            fetch("https://fapi.binance.com/fapi/v1/exchangeInfo"),
            fetch("https://fapi.binance.com/fapi/v1/ticker/24hr"),
            fetch("https://fapi.binance.com/fapi/v1/premiumIndex")
        ]);

        const exchange = await exchangeRes.json();
        const ticker = await tickerRes.json();
        const funding = await fundingRes.json();

        const fundingMap = new Map();

        for (const f of funding) {
            fundingMap.set(f.symbol, Number(f.lastFundingRate));
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

        const top = ticker
            .filter((t: any) => validSymbols.has(t.symbol))
            .sort((a: any, b: any) => Number(b.quoteVolume) - Number(a.quoteVolume))
            .slice(0, 150);

        const screener = await Promise.all(
            top.map(async (t: any) => {

                let openInterest = 0;

                try {

                    const res = await fetch(
                        `https://fapi.binance.com/fapi/v1/openInterest?symbol=${t.symbol}`
                    );

                    const data = await res.json();

                    openInterest = Number(data.openInterest);

                } catch {}

                const [rsi1h, rsi4h] = await Promise.all([
                    getRSI(t.symbol, "1h"),
                    getRSI(t.symbol, "4h")
                ]);

                return {
                    symbol: t.symbol,
                    price: Number(t.lastPrice),
                    change24h: Number(t.priceChangePercent),
                    volume: Number(t.quoteVolume),
                    openInterest,
                    funding: fundingMap.get(t.symbol) ?? 0,
                    rsi1h,
                    rsi4h
                };

            })
        );

        return NextResponse.json(screener);

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            { error: "Failed to load screener" },
            { status: 500 }
        );

    }
}
