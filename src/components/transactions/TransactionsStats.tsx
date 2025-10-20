"use client";

import React from "react";
import CardContainer from "@/components/elements/CardContainer";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

interface Stats {
    totalBuy: number;
    totalSell: number;
    count: number;
    net: number;
    avgSize: number;
    avgBuy: number;
    avgSell: number;
}

interface TransactionsStatsProps {
    stats?: Stats | null;
    loading?: boolean;
}

export default function TransactionsStats({ stats, loading }: TransactionsStatsProps) {
    if (loading || !stats) return null;

    const {lang} = useLanguage();
    const t = lang ==="uk" ? uk : en;

    return (
        <div className="px-4 py-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 transition-theme">
            <CardContainer className="text-center">
                <div className="text-sm text-[var(--color-text-muted)]">{t.totalBuy}</div>
                <div className="text-lg font-semibold text-green-500">
                    ${stats.totalBuy.toFixed(2)}
                </div>
            </CardContainer>

            <CardContainer className="text-center">
                <div className="text-sm text-[var(--color-text-muted)]">{t.totalSell}</div>
                <div className="text-lg font-semibold text-red-500">
                    ${stats.totalSell.toFixed(2)}
                </div>
            </CardContainer>

            <CardContainer className="text-center">
                <div className="text-sm text-[var(--color-text-muted)]">{t.transactions}</div>
                <div className="text-lg font-semibold text-blue-400">{stats.count}</div>
            </CardContainer>

            <CardContainer className="text-center">
                <div className="text-sm text-[var(--color-text-muted)]">{t.netFlow}</div>
                <div
                    className={`text-lg font-semibold ${
                        stats.net >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                >
                    ${stats.net.toFixed(2)}
                </div>
            </CardContainer>

            <CardContainer className="text-center hidden lg:block">
                <div className="text-sm text-[var(--color-text-muted)]">{t.avgBuy}</div>
                <div className="text-lg font-semibold text-[var(--color-text)]">
                    ${stats.avgBuy.toFixed(2)}
                </div>
            </CardContainer>

            <CardContainer className="text-center hidden lg:block">
                <div className="text-sm text-[var(--color-text-muted)]">{t.avgSell}</div>
                <div className="text-lg font-semibold text-[var(--color-text)]">
                    ${stats.avgSell.toFixed(2)}
                </div>
            </CardContainer>
        </div>
    );
}
