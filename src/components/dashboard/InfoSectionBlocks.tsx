import CardContainer from "@/components/elements/CardContainer";
import React from "react";
import {MyCoinsList} from "@/components";


export function InfoSectionBlocks(){
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CardContainer>
                <MyCoinsList/>
            </CardContainer>

            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)] mb-3">Recent Transactions</div>
                <div className="text-[var(--color-text-muted)] text-sm">Transactions Placeholder</div>
            </CardContainer>

            <CardContainer>
                <div className="text-sm text-[var(--color-text-muted)] mb-3">Portfolio Metrics</div>
                <div className="text-[var(--color-text-muted)] text-sm">Metrics Placeholder</div>
            </CardContainer>
        </div>
    )
}