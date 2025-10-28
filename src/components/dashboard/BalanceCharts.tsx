"use client";

import React from "react";
import CardContainer from "@/components/elements/CardContainer";
import { CircleChart } from "@/components";
import AveragePrice from "@/components/dashboard/AveragePrice";

export function BalanceCharts() {
    return (
        <div
            className="
        w-full
        flex flex-col
        md:flex-row
        gap-4
        transition-all
        duration-300
      "
        >
            {/* 🔹 Average Price (таблиця) */}
            <CardContainer
                className="
          h-auto
          md:h-[350px]
          w-full
          md:w-1/2
          flex
          flex-col
          justify-between
          transition-all
          duration-300
        "
            >
                <AveragePrice />
            </CardContainer>

            {/* 🔹 Кругова діаграма */}
            <CardContainer
                className="
          h-auto
          md:h-[350px]
          w-full
          md:w-1/2
          flex
          flex-col
          items-center
          justify-center
          transition-all
          duration-300
        "
            >
                <CircleChart />
            </CardContainer>
        </div>
    );
}
