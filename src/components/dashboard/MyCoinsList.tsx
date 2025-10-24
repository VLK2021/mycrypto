"use client";

import React, {useState, useMemo} from "react";
import {ChevronUp, ChevronDown} from "lucide-react";

import {usePortfolioData} from "@/hooks/usePortfolioData";
import {usePriceChanges} from "@/hooks/usePriceChanges";


export function MyCoinsList() {
    const {portfolio, loading} = usePortfolioData();

    const symbols = portfolio.map((coin) => `${coin.symbol.toUpperCase()}USDT`);
    const changes = usePriceChanges(symbols);

    // 🔹 Стан сортування
    const [sortBy, setSortBy] = useState<"price" | "change" | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // 🔹 Функція перемикання сортування
    const toggleSort = (type: "price" | "change") => {
        if (sortBy === type) {
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
        } else {
            setSortBy(type);
            setSortOrder("desc");
        }
    };

    // 🔹 Сортуємо монети
    const sortedPortfolio = useMemo(() => {
        return [...portfolio].sort((a, b) => {
            const changeA = changes[`${a.symbol.toUpperCase()}USDT`] ?? 0;
            const changeB = changes[`${b.symbol.toUpperCase()}USDT`] ?? 0;
            if (sortBy === "price") {
                return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
            }
            if (sortBy === "change") {
                return sortOrder === "asc" ? changeA - changeB : changeB - changeA;
            }
            return 0;
        });
    }, [portfolio, sortBy, sortOrder, changes]);

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
            {/* 🔹 Хедер */}
            <div
                className="flex items-center justify-between p-3 border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-10">
                <div className="text-sm text-[var(--color-text-muted)] font-semibold">
                    My Coins
                </div>

                <div className="flex items-center gap-6">
                    {/* 🔹 Кнопка сортування по ціні */}
                    <button
                        onClick={() => toggleSort("price")}
                        className="flex mr-6 items-center gap-1 text-[var(--color-text-muted)] text-sm font-medium hover:text-[var(--color-text)] transition"
                    >
                        Price
                        <div className="flex flex-col ml-1">
                            <ChevronUp
                                size={12}
                                className={`${
                                    sortBy === "price" && sortOrder === "asc"
                                        ? "text-[var(--color-text)]"
                                        : "opacity-40"
                                } -mb-1`}
                            />
                            <ChevronDown
                                size={12}
                                className={`${
                                    sortBy === "price" && sortOrder === "desc"
                                        ? "text-[var(--color-text)]"
                                        : "opacity-40"
                                }`}
                            />
                        </div>
                    </button>

                    {/* 🔹 Кнопка сортування по зміні 24h */}
                    <button
                        onClick={() => toggleSort("change")}
                        className="flex items-center gap-1 text-[var(--color-text-muted)] text-sm font-medium hover:text-[var(--color-text)] transition"
                    >
                        24h %
                        <div className="flex flex-col ml-1">
                            <ChevronUp
                                size={12}
                                className={`${
                                    sortBy === "change" && sortOrder === "asc"
                                        ? "text-[var(--color-text)]"
                                        : "opacity-40"
                                } -mb-1`}
                            />
                            <ChevronDown
                                size={12}
                                className={`${
                                    sortBy === "change" && sortOrder === "desc"
                                        ? "text-[var(--color-text)]"
                                        : "opacity-40"
                                }`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* 🔹 Список монет */}
            <div className="flex-1 overflow-y-auto p-2" style={{scrollbarWidth: "thin"}}>
                {sortedPortfolio.map((coin) => {
                    const formattedPrice = coin.price
                        .toFixed(9)
                        .replace(/0+$/, "")
                        .replace(/\.$/, "");
                    const change = changes[`${coin.symbol.toUpperCase()}USDT`] ?? 0;

                    return (
                        <div
                            key={coin.symbol}
                            className="flex items-center justify-between py-[6px] px-2 border-b border-[var(--color-border)]/40 last:border-none hover:bg-[var(--color-border)]/10 rounded transition"
                        >
              <span className="text-[var(--color-text)] text-sm font-medium">
                {coin.symbol}
              </span>

                            <div className="flex items-center gap-3">
                <span
                    className="text-[var(--color-text)] text-sm text-left font-mono"
                    style={{minWidth: "90px", display: "inline-block"}}
                >
                  ${formattedPrice}
                </span>

                                <span
                                    className={`text-sm font-semibold ${
                                        change > 0
                                            ? "text-green-500"
                                            : change < 0
                                                ? "text-red-500"
                                                : "text-[var(--color-text-muted)]"
                                    }`}
                                    style={{minWidth: "55px", textAlign: "right"}}
                                >
                  {change > 0 ? "+" : ""}
                                    {change.toFixed(2)}%
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
