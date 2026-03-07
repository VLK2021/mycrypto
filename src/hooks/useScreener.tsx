"use client";

import { useEffect, useState } from "react";
import { ScreenerCoin } from "@/interfaces/screener";

export function useScreener() {
    const [data, setData] = useState<ScreenerCoin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/screener");
            const json = await res.json();
            setData(json);
            setLoading(false);
        }

        load();
        const interval = setInterval(load, 60000);

        return () => clearInterval(interval);
    }, []);

    return { data, loading };
}
