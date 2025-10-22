"use client";

import { useEffect, useState } from "react";
import {useBinancePrices} from "@/lib";

// Типи даних
interface Holding {
    symbol: string;
    amount: number;
}

interface PortfolioItem {
    symbol: string;
    amount: number;
    price: number;
    value: number;
    percent: number;
}


export function usePortfolioData() {
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 🧠 1. Отримуємо монети з бекенду
    useEffect(() => {
        async function fetchHoldings() {
            try {
                const res = await fetch("/api/holdings");
                const json = await res.json();
                setHoldings(json.data || []);
            } catch (err) {
                console.error("❌ Failed to fetch holdings:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchHoldings();
    }, []);

    // 🧩 2. Формуємо масив тікетів для Binance (SOL → SOLUSDT)
    const symbols = holdings.map((h) => `${h.symbol}USDT`);

    // ⚡ 3. Отримуємо реальні ціни в реальному часі
    const prices = useBinancePrices(symbols);

    // 📊 4. Обчислення значень для графіка
    useEffect(() => {
        if (!holdings.length || Object.keys(prices).length === 0) return;

        const totalValue = holdings.reduce((acc, h) => {
            const price = prices[`${h.symbol}USDT`] || 0;
            return acc + h.amount * price;
        }, 0);

        const calculated = holdings.map((h) => {
            const price = prices[`${h.symbol}USDT`] || 0;
            const value = h.amount * price;
            const percent = totalValue > 0 ? (value / totalValue) * 100 : 0;

            return { symbol: h.symbol, amount: h.amount, price, value, percent };
        });

        setPortfolio(calculated);
    }, [holdings, prices]);

    // 🎯 5. Повертаємо готові дані для графіків чи віджетів
    return { portfolio, loading };
}
