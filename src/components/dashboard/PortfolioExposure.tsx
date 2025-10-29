"use client";

import React from "react";
import { usePortfolioWithCategories } from "@/hooks/usePortfolioWithCategories";
import { usePortfolioExposure } from "@/hooks/usePortfolioExposure";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";


export function PortfolioExposure() {
    const { portfolio, loading } = usePortfolioWithCategories();
    const { exposure, topHighRisk } = usePortfolioExposure(portfolio, loading);

    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)]">
                Завантаження...
            </div>
        );
    }

    if (!exposure) {
        return (
            <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)]">
                Немає даних
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* 🔹 Заголовок */}
            <div className="text-sm text-[var(--color-text-muted)] mb-1">
                Exposure
            </div>

            {/* 🔹 Відсотки ризиків */}
            <div className="flex justify-between text-[12px] font-semibold mb-1">
                <span className="text-red-500">High {exposure.high}%</span>
                <span className="text-yellow-500">Medium {exposure.medium}%</span>
                <span className="text-green-500">Low {exposure.low}%</span>
            </div>

            {/* 🔹 Найризиковіша монета + відсоток */}
            <div className="text-sm text-[var(--color-text-muted)] mt-1">
                Top Risk:{" "}
                {topHighRisk ? (
                    <>
                        <span className="font-semibold text-[var(--color-text)]">
                            {topHighRisk.symbol}
                        </span>{" "}
                        — {topHighRisk.percent}%
                    </>
                ) : (
                    <span className="text-[var(--color-text-muted)]">—</span>
                )}
            </div>
        </div>
    );
}
