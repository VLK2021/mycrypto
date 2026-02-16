import { NextResponse } from "next/server";

let cache: any = null;
let lastFetch = 0;


export async function GET() {
    const now = Date.now();

    if (cache && now - lastFetch < 60_000) {
        return NextResponse.json(cache);
    }

    try {
        const res = await fetch(
            "https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=1"
        );

        const data = await res.json();
        const item = data[0];

        cache = {
            long: parseFloat(item.longAccount) * 100,
            short: parseFloat(item.shortAccount) * 100,
            ratio: parseFloat(item.longShortRatio),
            updated: Date.now(),
        };

        lastFetch = now;

        return NextResponse.json(cache);
    } catch (e) {
        return NextResponse.json(cache || { error: "Failed" });
    }
}
