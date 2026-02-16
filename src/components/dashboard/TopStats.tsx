"use client";

import React from "react";
import CardContainer from "@/components/elements/CardContainer";
import {
    PortfolioExposure,
    PortfolioStructure,
    RealPnl,
    TotalBalance,
    TotalInvested,
} from "@/components";

export function TopStats() {
    return (
        <div
            className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-4
        w-full
        transition-all
        duration-300
      "
        >
            <CardContainer className="min-h-[120px] flex flex-col justify-center">
                <TotalBalance />
            </CardContainer>

            <CardContainer className="min-h-[120px] flex flex-col justify-center">
                <TotalInvested />
            </CardContainer>

            <CardContainer className="min-h-[120px] flex flex-col justify-center">
                <RealPnl />
            </CardContainer>

            <CardContainer className="min-h-[120px] flex flex-col justify-center">
                <PortfolioStructure />
            </CardContainer>

            <CardContainer className="min-h-[120px] flex flex-col justify-center">
                <PortfolioExposure />
            </CardContainer>

            <CardContainer className="min-h-[120px] flex flex-col justify-center">
                івафіваі
            </CardContainer>
        </div>
    );
}

