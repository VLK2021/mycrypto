"use client";

import React from "react";
import CardContainer from "@/components/elements/CardContainer";
import {PortfolioStructure, RealPnl, TotalBalance, TotalInvested} from "@/components";


export function TopStats() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            <CardContainer>
                <TotalBalance/>
            </CardContainer>

            <CardContainer>
                <TotalInvested/>
            </CardContainer>

            <CardContainer>
                <RealPnl/>
            </CardContainer>

            <CardContainer>
                <PortfolioStructure/>
            </CardContainer>

            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)]">Coins</div>
                <div className="text-2xl font-semibold mt-1">0</div>
            </CardContainer>
        </div>
    );
}
