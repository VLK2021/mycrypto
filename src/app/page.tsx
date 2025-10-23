import React from "react";
import {BalanceCharts, InfoSectionBlocks, TopStats} from "@/components";


export default function Home() {
    return (
        <div
            className="min-h-screen text-[var(--color-text)] bg-[var(--color-background)] px-1 md:px-8 py-3 flex flex-col gap-4"
        >
            <div className="w-full flex">
                <TopStats/>
            </div>

            <div className="w-full flex">
                <BalanceCharts/>
            </div>

            <div className="w-full flex">
                <InfoSectionBlocks/>
            </div>
        </div>
    );
}
