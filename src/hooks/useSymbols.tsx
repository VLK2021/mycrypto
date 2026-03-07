"use client";

import { useEffect, useState } from "react";

interface SymbolItem {
    label: string;
    value: string;
    icon?: string;
}

export function useSymbols() {
    const [symbols, setSymbols] = useState<SymbolItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSymbols() {
            try {
                const res = await fetch("/api/binance/symbols");

                if (!res.ok) {
                    throw new Error("Failed to fetch symbols");
                }

                const data = await res.json();

                setSymbols(data);
            } catch (error) {
                console.error("Symbols fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSymbols();
    }, []);

    return { symbols, loading };
}
