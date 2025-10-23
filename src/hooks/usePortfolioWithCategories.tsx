"use client";

import { usePortfolioData } from "@/hooks/usePortfolioData";

// Локальний словник категорій
const CATEGORY_MAP: Record<string, string> = {
    BTC: "Layer 1",
    ETH: "Layer 1",
    SOL: "Layer 1",
    XRP: "Layer 1",
    ARB: "Layer 2",
    OP: "Layer 2",
    JUP: "DeFi",
    W: "AI",
    WLFI: "DeFi",
    PEPE: "Memecoin",
    BONK: "Memecoin",
    FLOKI: "Memecoin",
    LDO: "DeFi",
    PUMP: "Memecoin",
};


export function usePortfolioWithCategories() {
    const { portfolio, loading } = usePortfolioData();

    // додаємо категорію кожному елементу портфеля
    const enriched = portfolio.map((p) => ({
        ...p,
        category: CATEGORY_MAP[p.symbol] || "Other",
    }));

    return { portfolio: enriched, loading };
}
