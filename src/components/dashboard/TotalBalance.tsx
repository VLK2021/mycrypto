"use client";

import React from "react";
import {usePortfolioData} from "@/hooks/usePortfolioData";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

export function TotalBalance() {
    const { portfolio, loading } = usePortfolioData();

    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;

    // 💰 Обчислення загального балансу
    const totalBalance = portfolio.reduce((acc, coin) => acc + coin.value, 0);

    if (loading) {
        return (
            <div className="w-full flex flex-col items-start justify-center">
                <div className="text-sm text-[var(--color-text-muted)]">
                    {t.totalBalance}
                </div>
                <div className="text-2xl font-semibold mt-1 text-[var(--color-text-muted)]">
                    Завантаження...
                </div>
            </div>
        );
    }


    return (
        <div className="w-full">
            <div className="text-sm text-[var(--color-text-muted)]">{t.totalBalance}</div>
            <div className="text-2xl font-semibold mt-1 text-green-500">
                ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
    );
}
