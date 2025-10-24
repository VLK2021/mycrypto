"use client";

import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";

interface FearGreedData {
    value: number;
    classification: string;
    previous: number;
    average7d: number;
}

export default function FearGreed() {
    const [data, setData] = useState<FearGreedData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/feargreed", {cache: "no-store"});
                const json = await res.json();

                if (!json?.data?.length) return;

                const current = Number(json.data[0].value);
                const previous = Number(json.data[1]?.value ?? current);
                const avg =
                    json.data
                        .slice(0, 7)
                        .reduce((a: number, i: any) => a + Number(i.value), 0) /
                    Math.min(json.data.length, 7);

                setData({
                    value: current,
                    classification: json.data[0].value_classification,
                    previous,
                    average7d: avg,
                });
            } catch (err) {
                console.error("⚠️ FearGreed fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center h-[350px] text-[var(--color-text-muted)]">
                Завантаження...
            </div>
        );

    if (!data)
        return (
            <div className="flex items-center justify-center h-[350px] text-[var(--color-text-muted)]">
                Дані недоступні
            </div>
        );

    const angle = 180 * (data.value / 100);
    const rad = (angle * Math.PI) / 180;
    const diff = data.value - data.previous;
    const diffColor =
        diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "text-gray-400";

    return (
        <div
            className="w-full h-[350px] rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-[var(--color-border)] sticky top-0 z-10">
                <div className="text-sm text-[var(--color-text-muted)] font-semibold">
                    Fear & Greed Index
                </div>
            </div>

            {/* Gauge */}
            <div className="flex-1 flex flex-col items-center justify-start relative pt-3">
                {/* SVG шкала */}
                <svg width="230" height="120" viewBox="0 0 230 120">
                    <defs>
                        <linearGradient
                            id="fearGreedGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor="#7f1d1d"/>
                            <stop offset="20%" stopColor="#dc2626"/>
                            <stop offset="40%" stopColor="#f59e0b"/>
                            <stop offset="55%" stopColor="#facc15"/>
                            <stop offset="70%" stopColor="#84cc16"/>
                            <stop offset="85%" stopColor="#16a34a"/>
                            <stop offset="100%" stopColor="#065f46"/>
                        </linearGradient>
                    </defs>

                    {/* Дуга */}
                    <path
                        d="M25 100 A90 90 0 0 1 205 100"
                        stroke="url(#fearGreedGrad)"
                        strokeWidth="18"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Стрілка */}
                    <line
                        x1="115"
                        y1="100"
                        x2={115 + 70 * Math.cos(Math.PI - rad)}
                        y2={100 - 70 * Math.sin(Math.PI - rad)}
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{
                            transition: "all 0.8s ease-in-out",
                            filter: "drop-shadow(0px 0px 4px rgba(255,255,255,0.6))",
                        }}
                    />
                    <circle
                        cx="115"
                        cy="100"
                        r="5"
                        fill="white"
                        style={{
                            filter: "drop-shadow(0px 0px 3px rgba(255,255,255,0.5))",
                        }}
                    />
                </svg>

                {/* Інформаційний блок */}
                <div className="mt-1 text-center">
                    <motion.div
                        key={data.value}
                        initial={{scale: 1.15, opacity: 0.8}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{duration: 0.4}}
                        className="text-4xl font-bold text-[var(--color-text)] mb-[2px] leading-none"
                    >
                        {data.value}
                    </motion.div>
                    <div className="text-sm text-[var(--color-text-muted)]">
                        {data.classification}
                    </div>
                    <div className={`text-xs ${diffColor}`}>
                        {diff > 0 ? "▲" : diff < 0 ? "▼" : "–"} {Math.abs(diff)} pts від учора
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-[2px]">
                        Середнє значення за 7 днів: {data.average7d.toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Легенда */}
            <div className="flex justify-around text-[11px] text-[var(--color-text-muted)] px-3 mt-auto mb-4">
        <span className="flex items-center gap-1 text-red-500/90">
          😱 Extreme Fear
        </span>
                <span className="flex items-center gap-1 text-amber-400/90">
          😨 Fear
        </span>
                <span className="flex items-center gap-1 text-yellow-300/90">
          😐 Neutral
        </span>
                <span className="flex items-center gap-1 text-lime-400/90">
          😏 Greed
        </span>
                <span className="flex items-center gap-1 text-green-700/90">
          🤩 Extreme Greed
        </span>
            </div>
        </div>
    );
}
