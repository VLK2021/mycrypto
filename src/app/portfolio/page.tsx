"use client"

import {TopStats} from "@/components";
import React from "react";
import uk from "@/locales/uk";
import en from "@/locales/en";
import {useLanguage} from "@/context";
import CardContainer from "@/components/elements/CardContainer";
import PortfolioTable from "@/components/portfolio/PortfolioTable";


export default function Portfolio() {
    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;


    return (
        <div
            className="min-h-screen text-[var(--color-text)] bg-[var(--color-background)] px-1 md:px-8 py-3 flex flex-col gap-4"
        >
            <h1 className="text-lg font-semibold mb-2">{"PORTFOLIO"}</h1>

            <div className="w-full flex">
                <TopStats/>
            </div>

            <div className={"w-full"}>
                <CardContainer className="w-full">
                    <PortfolioTable/>
                </CardContainer>
            </div>

        </div>
    )
}