"use client";

import React from "react";
import CardContainer from "@/components/elements/CardContainer";


export function BalanceCharts(props: any) {
    return (
        <div className={"w-full flex gap-4"}>
            <CardContainer className="h-[300px] w-[50%] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-[var(--color-text-muted)]">Balance Chart</div>
                    <div className="flex gap-2 text-xs">
                        <button className="px-2 py-1 rounded bg-[var(--color-background-light)]">1D</button>
                        <button className="px-2 py-1 rounded hover:bg-[var(--color-background-light)]">7D</button>
                        <button className="px-2 py-1 rounded hover:bg-[var(--color-background-light)]">30D</button>
                        <button className="px-2 py-1 rounded hover:bg-[var(--color-background-light)]">ALL</button>
                    </div>
                </div>
                <div className="flex-grow flex items-center justify-center text-[var(--color-text-muted)]">
                    Chart placeholder
                </div>
            </CardContainer>

            <CardContainer className="h-[300px] w-[50%] flex flex-col items-center justify-center">
                <div className="text-sm text-[var(--color-text-muted)] mb-2">Portfolio</div>
                <div className="w-[180px] h-[180px] rounded-full bg-[var(--color-background-light)] flex items-center justify-center text-[var(--color-text-muted)]">
                    Pie Chart
                </div>
            </CardContainer>
        </div>
    )
}