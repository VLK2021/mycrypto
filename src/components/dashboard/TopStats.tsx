"use client";

import React from "react";
import CardContainer from "@/components/elements/CardContainer";
import {PortfolioExposure, PortfolioStructure, RealPnl, TotalBalance, TotalInvested} from "@/components";


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
                <PortfolioExposure/>
            </CardContainer>
        </div>
    );
}
