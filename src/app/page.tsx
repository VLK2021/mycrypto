import React from "react";
import CardContainer from "@/components/elements/CardContainer";
import {BalanceCharts, TopStats} from "@/components";


export default function Home() {
    return (
        <div
            className="min-h-screen text-[var(--color-text)] bg-[var(--color-background)] px-1 md:px-8 py-3 flex flex-col gap-4"
        >
            <div className="w-full flex">
                <TopStats/>
            </div>

            <div className="w-full flex">
                <BalanceCharts/>
            </div>

            {/* ===== Нижній ряд: таблиці ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CardContainer className="h-[300px] lg:col-span-1">
                    <div className="text-sm text-[var(--color-text-muted)] mb-3">Top Assets</div>
                    <div className="text-[var(--color-text-muted)] text-sm">Assets Table Placeholder</div>
                </CardContainer>

                <CardContainer className="h-[300px] lg:col-span-1">
                    <div className="text-sm text-[var(--color-text-muted)] mb-3">Recent Transactions</div>
                    <div className="text-[var(--color-text-muted)] text-sm">Transactions Placeholder</div>
                </CardContainer>

                <CardContainer className="h-[300px] lg:col-span-1">
                    <div className="text-sm text-[var(--color-text-muted)] mb-3">Portfolio Metrics</div>
                    <div className="text-[var(--color-text-muted)] text-sm">Metrics Placeholder</div>
                </CardContainer>
            </div>
        </div>
    );
}
