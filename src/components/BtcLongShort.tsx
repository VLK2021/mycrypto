"use client";

import { useEffect, useState } from "react";

interface LongShortData {
    long: number;
    short: number;
}

export default function BtcLongShort() {
    const [data, setData] = useState<LongShortData | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const res = await fetch("/api/longshort", {
                    cache: "no-store", // важливо!
                });

                const json = await res.json();

                if (json.long && json.short) {
                    setData({
                        long: json.long,
                        short: json.short,
                    });
                }
            } catch {
                setData(null);
            }
        };

        // перший виклик
        fetchData();

        // кожні 60 секунд
        interval = setInterval(fetchData, 60_000);

        return () => clearInterval(interval);
    }, []);

    if (!data) {
        return (
            <div className="text-sm text-[var(--color-text-muted)]">
                Дані недоступні
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="text-sm font-semibold text-[var(--color-text-muted)]">
                BTC Long / Short Ratio
            </div>

            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden flex">
                <div
                    className="bg-green-500 transition-all duration-500"
                    style={{ width: `${data.long}%` }}
                />
                <div
                    className="bg-red-500 transition-all duration-500"
                    style={{ width: `${data.short}%` }}
                />
            </div>

            <div className="flex justify-between text-sm font-medium">
        <span className="text-green-400">
          {data.long.toFixed(1)}% Long
        </span>
                <span className="text-red-400">
          {data.short.toFixed(1)}% Short
        </span>
            </div>
        </div>
    );
}
