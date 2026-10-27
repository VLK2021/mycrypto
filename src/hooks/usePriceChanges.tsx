// "use client";
//
// import { useEffect, useState } from "react";
//
//
// export function usePriceChanges(symbols: string[]) {
//     const [changes, setChanges] = useState<Record<string, number>>({});
//
//     useEffect(() => {
//         if (!symbols.length) return;
//
//         let cancelled = false;
//
//         async function fetchChanges() {
//             try {
//                 const results: { symbol: string; change: number }[] = [];
//
//                 for (let i = 0; i < symbols.length; i += 5) {
//                     const batch = symbols.slice(i, i + 5);
//
//                     const batchResults = await Promise.all(
//                         batch.map(async (s) => {
//                             const symbol = s.toUpperCase(); // 👈 ось ключовий момент!
//                             try {
//                                 const res = await fetch(
//                                     `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
//                                 );
//
//                                 if (!res.ok) throw new Error("Not found");
//
//                                 const data = await res.json();
//                                 return {
//                                     symbol,
//                                     change: parseFloat(data.priceChangePercent || "0"),
//                                 };
//                             } catch (err) {
//                                 console.warn(`⚠️ ${symbol}:`, (err as Error).message);
//                                 return { symbol, change: 0 };
//                             }
//                         })
//                     );
//
//                     results.push(...batchResults);
//                     await new Promise((r) => setTimeout(r, 250)); // невелика пауза
//                 }
//
//                 if (cancelled) return;
//
//                 const mapped = results.reduce((acc, { symbol, change }) => {
//                     acc[symbol] = change;
//                     return acc;
//                 }, {} as Record<string, number>);
//
//                 setChanges(mapped);
//             } catch (e) {
//                 console.warn("usePriceChanges global error:", e);
//             }
//         }
//
//         fetchChanges();
//         const interval = setInterval(fetchChanges, 30_000);
//
//         return () => {
//             cancelled = true;
//             clearInterval(interval);
//         };
//     }, [symbols.join(",")]);
//
//     return changes;
// }



"use client";

import { useEffect, useMemo, useState } from "react";

type PriceChanges = Record<string, number>;

interface BinanceTicker24h {
    symbol: string;
    priceChangePercent: string;
}

const UPDATE_INTERVAL = 30_000;

export function usePriceChanges(symbols: string[]) {
    const [changes, setChanges] = useState<PriceChanges>({});

    // Нормалізуємо список монет
    const symbolsKey = useMemo(() => {
        return [...new Set(
            symbols.map((s) => s.trim().toUpperCase())
        )]
            .filter(Boolean)
            .sort()
            .join(",");
    }, [symbols.join(",")]);

    useEffect(() => {
        if (!symbolsKey) {
            setChanges({});
            return;
        }

        const controller = new AbortController();
        const normalizedSymbols = symbolsKey.split(",");

        let timer: ReturnType<typeof setTimeout> | null = null;

        async function fetchChanges() {
            try {
                const params = new URLSearchParams({
                    symbols: JSON.stringify(normalizedSymbols),
                });

                const res = await fetch(
                    `https://api.binance.com/api/v3/ticker/24hr?${params.toString()}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error(
                        `Binance API error: ${res.status}`
                    );
                }

                const data: BinanceTicker24h[] = await res.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid Binance response");
                }

                const mapped: PriceChanges = {};

                for (const item of data) {
                    const change = Number(item.priceChangePercent);

                    if (Number.isFinite(change)) {
                        mapped[item.symbol] = change;
                    }
                }

                if (!controller.signal.aborted) {
                    setChanges(mapped);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.warn(
                        "usePriceChanges error:",
                        error
                    );
                }
            } finally {
                // Наступний цикл лише після завершення поточного
                if (!controller.signal.aborted) {
                    timer = setTimeout(
                        fetchChanges,
                        UPDATE_INTERVAL
                    );
                }
            }
        }

        fetchChanges();

        return () => {
            controller.abort();

            if (timer !== null) {
                clearTimeout(timer);
            }
        };
    }, [symbolsKey]);

    return changes;
}
