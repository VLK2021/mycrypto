import CardContainer from "@/components/elements/CardContainer";
import React from "react";
import {MyCoinsList} from "@/components";
import FearGreed from "@/components/dashboard/FearGreed";
import MarketMetrics from "@/components/dashboard/MarketMetrics";


export function InfoSectionBlocks(){
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CardContainer>
                <MyCoinsList/>
            </CardContainer>

            <CardContainer>
                <FearGreed/>
            </CardContainer>

            <CardContainer>
                <MarketMetrics/>
            </CardContainer>
        </div>
    )
}