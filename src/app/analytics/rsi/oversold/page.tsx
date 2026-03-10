"use client"

import { useEffect, useMemo, useState } from "react"

type RsiItem = {
    symbol: string
    price: number

    rsi_1h: number
    rsi_4h: number

    candles_overbought_1h: number
    candles_oversold_1h: number

    candles_overbought_4h: number
    candles_oversold_4h: number
}

export default function OversoldPage() {

    const [coins, setCoins] = useState<RsiItem[]>([])
    const [loading, setLoading] = useState(true)

    const [timeframe, setTimeframe] = useState<"1h" | "4h">("4h")
    const [level, setLevel] = useState(20)

    useEffect(() => {

        const load = async () => {

            try {

                const res = await fetch("/api/rsi")

                const json = await res.json()

                setCoins(json.data)

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [])


    const filteredCoins = useMemo(() => {

        const key = timeframe === "1h" ? "rsi_1h" : "rsi_4h"

        return coins
            .filter((coin) => coin[key] <= level)
            .sort((a, b) => a[key] - b[key])

    }, [coins, timeframe, level])


    return (

        <div className="w-full flex flex-col gap-8 px-6 py-6">


            {/* FILTER PANEL */}

            <div className="w-full bg-[#0f1628] border border-[#1c2544] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-6">


                {/* TIMEFRAME */}

                <div className="flex items-center gap-4">

                    <span className="text-gray-400 text-sm">
                        Таймфрейм
                    </span>

                    <div className="flex bg-[#0b1223] rounded-xl p-1">

                        <button
                            onClick={() => setTimeframe("1h")}
                            className={`px-5 py-1.5 rounded-lg text-sm transition
                            ${timeframe === "1h"
                                ? "bg-blue-500 text-white shadow-md"
                                : "text-gray-400 hover:text-white"}`}
                        >
                            1ч
                        </button>

                        <button
                            onClick={() => setTimeframe("4h")}
                            className={`px-5 py-1.5 rounded-lg text-sm transition
                            ${timeframe === "4h"
                                ? "bg-blue-500 text-white shadow-md"
                                : "text-gray-400 hover:text-white"}`}
                        >
                            4ч
                        </button>

                    </div>

                </div>


                {/* RSI LEVEL */}

                <div className="flex items-center gap-5">

                    <span className="text-gray-400 text-sm">
                        RSI рівень
                    </span>

                    <div className="flex gap-4">

                        <button
                            onClick={() => setLevel(20)}
                            className={`px-8 py-3 rounded-xl font-semibold text-base transition
                            ${level === 20
                                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                : "bg-[#111a33] text-gray-300 hover:bg-[#1a2447]"}`}
                        >
                            ≤20
                        </button>

                        <button
                            onClick={() => setLevel(10)}
                            className={`px-8 py-3 rounded-xl font-semibold text-base transition
                            ${level === 10
                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                : "bg-[#111a33] text-gray-300 hover:bg-[#1a2447]"}`}
                        >
                            ≤10
                        </button>

                    </div>

                </div>

            </div>


            {/* RESULTS */}

            <div className="w-full bg-[#0f1628] border border-[#1c2544] rounded-2xl overflow-hidden">


                <div className="grid grid-cols-3 px-6 py-3 text-gray-400 text-sm border-b border-[#1c2544]">

                    <div>Монета</div>

                    <div className="text-right">Ціна</div>

                    <div className="text-right">
                        RSI ({timeframe})
                    </div>

                </div>


                {loading && (

                    <div className="text-center py-10 text-gray-400">
                        Loading scanner...
                    </div>

                )}


                {!loading && filteredCoins.map((coin) => {

                    const rsi =
                        timeframe === "1h"
                            ? coin.rsi_1h
                            : coin.rsi_4h

                    const candles =
                        timeframe === "1h"
                            ? coin.candles_oversold_1h
                            : coin.candles_oversold_4h


                    return (

                        <div
                            key={coin.symbol}
                            className="grid grid-cols-3 px-6 py-3 border-t border-[#1c2544] hover:bg-[#141d38] transition"
                        >

                            <div className="text-white font-medium">
                                {coin.symbol}
                            </div>

                            <div className="text-right text-gray-300">
                                {coin.price.toFixed(4)}
                            </div>

                            <div className="text-right text-green-400 font-semibold">

                                {rsi}

                                {candles > 0 && (
                                    <span className="text-gray-400 text-sm ml-2">
                                        ({candles})
                                    </span>
                                )}

                            </div>

                        </div>

                    )

                })}

            </div>

        </div>

    )
}