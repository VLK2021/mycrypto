"use client";

import React from "react";
import {usePortfolioWithCategories} from "@/hooks";


export function PortfolioStructure() {
    const {portfolio, loading} = usePortfolioWithCategories();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)]">
                Завантаження...
            </div>
        );
    }

    if (!portfolio.length) {
        return (
            <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)]">
                Поки немає монет у портфелі
            </div>
        );
    }

    // 🔹 Кількість монет
    const totalCoins = portfolio.length;

    // 🔹 Кількість секторів
    const uniqueSectors = new Set(portfolio.map((p) => p.category)).size;

    // 🔹 Топ монета за вартістю
    const topAsset = [...portfolio].sort((a, b) => b.value - a.value)[0];

    return (
        <div className="w-full flex flex-col justify-center h-full">
            <div className="text-sm text-[var(--color-text-muted)] mb-1">
                Portfolio Structure
            </div>

            {/* 🔹 Основна інформація в 1 рядок */}
            <div className="flex items-baseline justify-start text-[var(--color-text)]">
                <div className="text-1xl">
                    {totalCoins} Coins
                    <span className="text-1xl text-[var(--color-text)]">
                        / {uniqueSectors} Sectors
                     </span>
                </div>
            </div>

            {/* 🔹 Топ монета */}
            <div className="text-xs mt-2">
                <span className="font-semibold text-[var(--color-text)]">
                    {topAsset.symbol}
                </span>{" "}

                <span className="text-[var(--color-text-muted)]">
                     — {topAsset.category || "Unknown"} ({topAsset.percent.toFixed(2)}%)
                 </span>
            </div>
        </div>
    );
}
