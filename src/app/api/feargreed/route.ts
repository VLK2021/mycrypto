import { NextResponse } from "next/server";

let cache: any = null;
let lastFetch = 0;

export async function GET() {
    const now = Date.now();

    // Якщо минуло менше 15 хв — повертаємо кеш
    if (cache && now - lastFetch < 15 * 60 * 1000) {
        return NextResponse.json(cache);
    }

    try {
        const res = await fetch("https://api.alternative.me/fng/");
        const data = await res.json();

        // 🔹 Повертаємо формат, який очікує фронтенд
        cache = {
            data: data.data, // саме масив із API Alternative.me
            meta: {
                lastUpdate: new Date().toISOString(),
            },
        };
        lastFetch = now;

        return NextResponse.json(cache);
    } catch (e) {
        console.error("Error fetching Fear & Greed:", e);
        return NextResponse.json({ data: [], error: "Failed to fetch" });
    }
}

