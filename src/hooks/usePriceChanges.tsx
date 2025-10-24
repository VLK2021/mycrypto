"use client";

import { useEffect, useState } from "react";


export function usePriceChanges(symbols: string[]) {
    const [changes, setChanges] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!symbols.length) return;

        let cancelled = false;

        async function fetchChanges() {
            try {
                const results: { symbol: string; change: number }[] = [];

                for (let i = 0; i < symbols.length; i += 5) {
                    const batch = symbols.slice(i, i + 5);

                    const batchResults = await Promise.all(
                        batch.map(async (s) => {
                            const symbol = s.toUpperCase(); // 👈 ось ключовий момент!
                            try {
                                const res = await fetch(
                                    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
                                );

                                if (!res.ok) throw new Error("Not found");

                                const data = await res.json();
                                return {
                                    symbol,
                                    change: parseFloat(data.priceChangePercent || "0"),
                                };
                            } catch (err) {
                                console.warn(`⚠️ ${symbol}:`, (err as Error).message);
                                return { symbol, change: 0 };
                            }
                        })
                    );

                    results.push(...batchResults);
                    await new Promise((r) => setTimeout(r, 250)); // невелика пауза
                }

                if (cancelled) return;

                const mapped = results.reduce((acc, { symbol, change }) => {
                    acc[symbol] = change;
                    return acc;
                }, {} as Record<string, number>);

                setChanges(mapped);
            } catch (e) {
                console.warn("usePriceChanges global error:", e);
            }
        }

        fetchChanges();
        const interval = setInterval(fetchChanges, 60_000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [symbols.join(",")]);

    return changes;
}
