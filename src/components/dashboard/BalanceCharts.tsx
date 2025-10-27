import React from "react";

import CardContainer from "@/components/elements/CardContainer";
import {CircleChart} from "@/components";
import AveragePrice from "@/components/dashboard/AveragePrice";


export function BalanceCharts(props: any) {
    return (
        <div className={"w-full flex gap-4"}>
            <CardContainer className="h-[300px] w-[50%] flex flex-col justify-between">
                <AveragePrice/>
            </CardContainer>

            <CardContainer className="h-[300px] w-[50%] flex flex-col items-center justify-center">
                <CircleChart/>
            </CardContainer>
        </div>
    )
}