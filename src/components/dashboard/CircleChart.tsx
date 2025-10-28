"use client";

import React from "react";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import * as d3 from "d3-scale-chromatic";

import {usePortfolioData} from "@/hooks/usePortfolioData";


export function CircleChart() {
    const {portfolio, loading} = usePortfolioData();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[250px] text-[var(--color-text-muted)]">
                Завантаження...
            </div>
        );
    }

    if (!portfolio.length) {
        return (
            <div className="flex items-center justify-center h-[250px] text-[var(--color-text-muted)]">
                Поки немає монет у портфелі
            </div>
        );
    }

    const COLORS = portfolio.map((_, i) =>
        d3.interpolateRainbow(i / portfolio.length)
    );

    // 🧮 Дані для графіка (відсортовані по відсотку — від більшого до меншого)
    const chartData = portfolio
        .map((coin) => ({
            name: coin.symbol,
            value: parseFloat(coin.percent.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value); // 🔥 сортування по спаданню


    return (
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-4 p-2">
            {/* 🔹 Ліва частина: монети у два стовпчики */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs w-full md:w-1/2">
                <div className="col-span-2 text-[var(--color-text-muted)] text-[19px] mb-6 font-bold uppercase">
                    Portfolio Allocation
                </div>
                {chartData.map((coin, index) => (
                    <div key={coin.name} className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{backgroundColor: COLORS[index % COLORS.length]}}
                                ></div>
                                <span className="text-[var(--color-text)] text-[13px] font-semibold">
                                    {coin.name}
                                </span>
                            </div>
                            <span className="text-[var(--color-text-muted)] text-[13px]">
                                    {coin.value.toFixed(2)}%
                             </span>
                        </div>

                        <div className="text-[var(--color-text-muted)] text-[12px] ml-5">
                            ${portfolio.find((p) => p.symbol === coin.name)?.value.toFixed(2) ?? "0.00"}
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔹 Права частина: кругова діаграма */}
            <div className="flex items-center justify-center w-full md:w-1/2">
                <div className="w-[250px] h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="100%"
                                innerRadius={0}
                                startAngle={90}
                                endAngle={-270} // повне коло
                                isAnimationActive={false}
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="var(--color-background)"
                                        strokeWidth={1}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => `${value.toFixed(2)}%`}
                                contentStyle={{
                                    backgroundColor: "var(--color-background)",
                                    border: "1px solid var(--color-border)",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                }}
                                itemStyle={{
                                    color: "#22c55e",
                                    fontWeight: 500,
                                }}
                            />

                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
