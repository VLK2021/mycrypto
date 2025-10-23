"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export function MyCoinsList() {
    const { portfolio, loading } = usePortfolioData();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[350px] text-[var(--color-text-muted)]">
                Завантаження...
            </div>
        );
    }

    if (!portfolio.length) {
        return (
            <div className="flex items-center justify-center h-[350px] text-[var(--color-text-muted)]">
                Немає монет у портфелі
            </div>
        );
    }

    return (
        <div className="w-full h-[350px] rounded-lg border border-[var(--color-border)] flex flex-col">
            {/* 🔹 Фіксований заголовок */}
            <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-10">
                <div className="text-sm text-[var(--color-text-muted)] font-semibold">
                    My Coins
                </div>
            </div>

            {/* 🔹 Прокручується лише список монет */}
            <div
                className="flex-1 overflow-y-auto p-2"
                style={{ scrollbarWidth: "thin" }}
            >
                {portfolio.map((coin) => {
                    const formattedPrice = coin.price
                        .toFixed(9)
                        .replace(/0+$/, "")
                        .replace(/\.$/, "");

                    return (
                        <div
                            key={coin.symbol}
                            className="flex items-center justify-between py-[6px] px-2 border-b border-[var(--color-border)]/40 last:border-none hover:bg-[var(--color-border)]/10 rounded transition"
                        >
              <span className="text-[var(--color-text)] text-sm font-medium">
                {coin.symbol}
              </span>

                            <span
                                className="text-[var(--color-text)] text-sm text-left font-mono"
                                style={{ minWidth: "90px", display: "inline-block" }}
                            >
                ${formattedPrice}
              </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
