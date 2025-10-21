"use client";

import React from "react";
import CardContainer from "@/components/elements/CardContainer";


export function TopStats() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)]">Total Balance</div>
                <div className="text-2xl font-semibold mt-1">$0.00</div>
            </CardContainer>

            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)]">All-time PnL</div>
                <div className="text-2xl font-semibold mt-1 text-green-500">+$0.00</div>
            </CardContainer>

            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)]">PnL %</div>
                <div className="text-2xl font-semibold mt-1 text-green-500">+0.00%</div>
            </CardContainer>

            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)]">Coins</div>
                <div className="text-2xl font-semibold mt-1">0</div>
            </CardContainer>

            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)]">Coins</div>
                <div className="text-2xl font-semibold mt-1">0</div>
            </CardContainer>
        </div>
    );
}
