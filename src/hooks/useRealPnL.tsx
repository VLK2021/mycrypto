"use client";

import { useEffect, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";


export function useRealPnL() {
    const { portfolio, loading } = usePortfolioData();
    const [invested, setInvested] = useState(0);
    const [pnl, setPnl] = useState(0);
    const [pnlPercent, setPnlPercent] = useState(0);

    // 1️⃣ Отримуємо вкладену суму (static)
    useEffect(() => {
        async function fetchInvested() {
            try {
                const res = await fetch("/api/invested");
                const json = await res.json();
                setInvested(json.totalInvested || 0);
            } catch (err) {
                console.error("❌ Failed to fetch invested:", err);
            }
        }
        fetchInvested();
    }, []);

    // 2️⃣ Коли є реальні ціни — обчислюємо живий PnL
    useEffect(() => {
        if (loading || !portfolio.length || invested === 0) return;

        const totalValue = portfolio.reduce((acc, coin) => acc + coin.value, 0);
        const pnlValue = totalValue - invested;
        const pnlPerc = (pnlValue / invested) * 100;

        setPnl(pnlValue);
        setPnlPercent(pnlPerc);
    }, [portfolio, invested, loading]);

    return { pnl, pnlPercent, invested, loading };
}
