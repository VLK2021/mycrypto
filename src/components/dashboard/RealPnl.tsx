"use client";
import React from "react";
import { useRealPnL } from "@/hooks/useRealPnL";


export function RealPnl() {
    const { pnl, pnlPercent, loading } = useRealPnL();

    const isPositive = pnl >= 0;
    const pnlColor = isPositive ? "text-green-500" : "text-red-500";


    return (
        <div className="w-full">
            <div className="text-sm text-[var(--color-text-muted)]">Real-Time PnL</div>
            {loading ? (
                <div className="text-[var(--color-text-muted)] mt-1">Loading...</div>
            ) : (
                <div className={`text-2xl font-semibold mt-1 ${pnlColor}`}>
                    {pnl >= 0 ? "+" : ""}
                    {pnl.toFixed(2)} USD
                    <span className="text-sm ml-2 text-[var(--color-text-muted)]">
                        ({pnlPercent.toFixed(2)}%)
                    </span>
                </div>
            )}
        </div>
    );
}
