// "use client";
//
// import React, { useEffect, useState, useRef } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import AvgPriceUpdateModal from "@/components/modals/AvgPriceUpdateModal";
// import {useLanguage} from "@/context";
// import uk from "@/locales/uk";
// import en from "@/locales/en";
//
// interface AvgItem {
//     symbol: string;
//     price: number;
//     date: string;
// }
//
// interface CombinedItem extends AvgItem {
//     current: number;
//     diffUsd: number;
//     diffPercent: number;
//     status: "profit" | "loss" | "neutral";
// }
//
// type SortKey = "price" | "current" | "diffUsd" | "diffPercent";
// type SortOrder = "asc" | "desc";
//
// function formatPrice(value: number): string {
//     if (isNaN(value)) return "-";
//     return value.toFixed(9).replace(/\.?0+$/, "");
// }
//
// export default function AveragePrice() {
//     const [data, setData] = useState<CombinedItem[]>([]);
//     const [sortKey, setSortKey] = useState<SortKey>("diffPercent");
//     const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//     const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//     const [selectedSymbol, setSelectedSymbol] = useState<CombinedItem | null>(null);
//     const wsRef = useRef<WebSocket | null>(null);
//
//     const {lang} = useLanguage();
//     const t = lang === "uk" ? uk : en;
//
//     useEffect(() => {
//         let ws: WebSocket | null = null;
//         let reconnectTimer: NodeJS.Timeout | null = null;
//
//         const init = async () => {
//             try {
//                 const res = await fetch("/api/manual-average-price");
//                 const rawList = await res.json();
//
//                 const avgList: AvgItem[] = rawList.map((item: any) => ({
//                     ...item,
//                     price: parseFloat(item.price),
//                 }));
//
//                 if (!avgList.length) return;
//
//                 const streams = avgList
//                     .map((x) => `${x.symbol.toLowerCase()}usdt@ticker`)
//                     .join("/");
//
//                 ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
//                 wsRef.current = ws;
//
//                 const initial = avgList.map((a) => ({
//                     ...a,
//                     current: 0,
//                     diffUsd: 0,
//                     diffPercent: 0,
//                     status: "neutral" as const,
//                 }));
//                 setData(initial);
//
//                 ws.onmessage = (event) => {
//                     const message = JSON.parse(event.data);
//                     const payload = message.data;
//                     if (!payload?.s || !payload?.c) return;
//
//                     const symbol = payload.s.replace("USDT", "");
//                     const current = parseFloat(payload.c);
//
//                     setData((prev) =>
//                         prev.map((item) => {
//                             if (item.symbol.toUpperCase() === symbol.toUpperCase()) {
//                                 const diffUsd = current - item.price;
//                                 const diffPercent = (diffUsd / item.price) * 100;
//                                 const status =
//                                     diffUsd > 0 ? "profit" : diffUsd < 0 ? "loss" : "neutral";
//                                 return { ...item, current, diffUsd, diffPercent, status };
//                             }
//                             return item;
//                         })
//                     );
//                 };
//
//                 ws.onerror = (err) => {
//                     console.warn("⚠️ WebSocket error:", err);
//                 };
//
//                 ws.onclose = () => {
//                     console.log("🔌 WebSocket closed, reconnecting...");
//                     reconnectTimer = setTimeout(init, 2000);
//                 };
//             } catch (err) {
//                 console.error("❌ Init error:", err);
//             }
//         };
//
//         init();
//
//         // ✅ Очищення при розмонтуванні або зміні сторінки
//         return () => {
//             if (ws) {
//                 ws.onclose = null;
//                 ws.onerror = null;
//                 ws.onmessage = null;
//                 ws.close();
//             }
//             if (reconnectTimer) clearTimeout(reconnectTimer);
//         };
//     }, []);
//
//
//     const sortedData = [...data].sort((a, b) => {
//         const valA = a[sortKey] ?? 0;
//         const valB = b[sortKey] ?? 0;
//         return sortOrder === "asc" ? valA - valB : valB - valA;
//     });
//
//     const toggleSort = (key: SortKey) => {
//         if (sortKey === key) {
//             setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//         } else {
//             setSortKey(key);
//             setSortOrder("desc");
//         }
//     };
//
//     const handleOpenModal = (item: CombinedItem) => {
//         setSelectedSymbol(item);
//         setIsUpdateOpen(true);
//     };
//
//     if (!data.length)
//         return (
//             <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
//                 Loading...
//             </div>
//         );
//
//     return (
//         <div className="flex flex-col h-full w-full text-[var(--color-text)]">
//             {/* 🧭 Хедер */}
//             <div className="sticky top-0 z-10 flex justify-between bg-[var(--color-card)] px-3 py-2 border-b border-[var(--color-border)] rounded-t-lg select-none">
//                 <div className="w-[15%] text-left text-sm font-semibold opacity-70">
//                     {t.symbol}
//                 </div>
//                 <HeaderCell
//                     label={t.avgPrice}
//                     sortKey="price"
//                     activeKey={sortKey}
//                     order={sortOrder}
//                     onClick={toggleSort}
//                 />
//                 <HeaderCell
//                     label={t.price}
//                     sortKey="current"
//                     activeKey={sortKey}
//                     order={sortOrder}
//                     onClick={toggleSort}
//                 />
//                 <HeaderCell
//                     label="Δ $"
//                     sortKey="diffUsd"
//                     activeKey={sortKey}
//                     order={sortOrder}
//                     onClick={toggleSort}
//                 />
//                 <HeaderCell
//                     label="Δ %"
//                     sortKey="diffPercent"
//                     activeKey={sortKey}
//                     order={sortOrder}
//                     onClick={toggleSort}
//                 />
//
//                 <div className="w-[10%] text-right text-sm font-semibold opacity-70">
//                     {t.status}
//                 </div>
//             </div>
//
//             {/* 📊 Таблиця */}
//             <div className="flex flex-col gap-1 overflow-y-auto pr-1 h-[240px] mt-1">
//                 {sortedData.map((item) => (
//                     <div
//                         key={item.symbol}
//                         className="flex justify-between items-center px-3 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-border)]/10 transition-all duration-150"
//                     >
//                         <div className="flex items-center gap-2 w-[15%] font-semibold">
//                             {item.symbol}
//                         </div>
//
//                         {/* Avg Price (натискання відкриває модалку) */}
//                         <div
//                             className="w-[20%] text-right text-sm opacity-80 cursor-pointer hover:text-blue-400 transition"
//                             onClick={() => handleOpenModal(item)}
//                         >
//                             {formatPrice(item.price)} $
//                         </div>
//
//                         <div className="w-[20%] text-right text-sm font-medium">
//                             {item.current ? formatPrice(item.current) : "-"} $
//                         </div>
//
//                         <div
//                             className={`w-[15%] text-right text-sm font-semibold ${
//                                 item.diffUsd > 0
//                                     ? "text-green-400"
//                                     : item.diffUsd < 0
//                                         ? "text-red-400"
//                                         : "text-gray-400"
//                             }`}
//                         >
//                             {item.diffUsd > 0 ? "+" : ""}
//                             {item.diffUsd.toFixed(2)}$
//                         </div>
//
//                         <div
//                             className={`w-[15%] text-right text-sm font-semibold ${
//                                 item.diffPercent > 0
//                                     ? "text-green-400"
//                                     : item.diffPercent < 0
//                                         ? "text-red-400"
//                                         : "text-gray-400"
//                             }`}
//                         >
//                             {item.diffPercent > 0 ? "+" : ""}
//                             {item.diffPercent.toFixed(2)}%
//                         </div>
//
//                         <div
//                             className={`w-[10%] text-right font-bold tracking-wide ${
//                                 item.status === "profit"
//                                     ? "text-green-400"
//                                     : item.status === "loss"
//                                         ? "text-red-400"
//                                         : "text-gray-400"
//                             }`}
//                         >
//                             {item.status === "profit"
//                                 ? "profit"
//                                 : item.status === "loss"
//                                     ? "loss"
//                                     : "-"}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//
//             {/* 🟣 Модалка оновлення */}
//             {isUpdateOpen && selectedSymbol && (
//                 <AvgPriceUpdateModal
//                     setIsUpdateOpen={setIsUpdateOpen}
//                     symbol={selectedSymbol.symbol}
//                     currentPrice={selectedSymbol.price}
//                     currentDate={selectedSymbol.date}
//                 />
//             )}
//         </div>
//     );
// }
//
// // 🔹 Хедер
// function HeaderCell({
//                         label,
//                         sortKey,
//                         activeKey,
//                         order,
//                         onClick,
//                     }: {
//     label: string;
//     sortKey: SortKey;
//     activeKey: SortKey;
//     order: SortOrder;
//     onClick: (key: SortKey) => void;
// }) {
//     const isActive = activeKey === sortKey;
//     return (
//         <div
//             className="w-[20%] text-right text-sm font-semibold opacity-70 cursor-pointer flex items-center justify-end gap-1 hover:opacity-100 transition"
//             onClick={() => onClick(sortKey)}
//         >
//             {label}
//             <div className="flex flex-col leading-none text-[10px]">
//                 <ChevronUp
//                     size={12}
//                     className={`${
//                         isActive && order === "asc" ? "text-green-400" : "opacity-40"
//                     }`}
//                 />
//                 <ChevronDown
//                     size={12}
//                     className={`${
//                         isActive && order === "desc" ? "text-green-400" : "opacity-40"
//                     }`}
//                 />
//             </div>
//         </div>
//     );
// }
//





"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { ChevronUp, ChevronDown } from "lucide-react";
import AvgPriceUpdateModal from "@/components/modals/AvgPriceUpdateModal";

import { useBinancePrices } from "@/lib";
import { useLanguage } from "@/context";

import uk from "@/locales/uk";
import en from "@/locales/en";

// ===================== TYPES =====================

interface AvgItem {
    symbol: string;
    price: number;
    date: string;
}

interface CombinedItem extends AvgItem {
    current: number | null;
    diffUsd: number | null;
    diffPercent: number | null;
    status: "profit" | "loss" | "neutral";
}

type SortKey = "price" | "current" | "diffUsd" | "diffPercent";
type SortOrder = "asc" | "desc";

// ===================== HELPERS =====================

function formatPrice(value: number): string {
    if (!Number.isFinite(value)) return "-";

    return value
        .toFixed(9)
        .replace(/\.?0+$/, "");
}

function formatDifference(value: number | null): string {
    if (value === null) return "-";

    return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

// ===================== COMPONENT =====================

export default function AveragePrice() {
    const [avgPrices, setAvgPrices] = useState<AvgItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [sortKey, setSortKey] =
        useState<SortKey>("diffPercent");

    const [sortOrder, setSortOrder] =
        useState<SortOrder>("desc");

    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const [selectedSymbol, setSelectedSymbol] =
        useState<CombinedItem | null>(null);

    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;

    // ===================== LOAD AVERAGE PRICES =====================

    useEffect(() => {
        const controller = new AbortController();

        async function fetchAveragePrices() {
            try {
                const res = await fetch(
                    "/api/manual-average-price",
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error(
                        `Failed to load average prices: ${res.status}`
                    );
                }

                const rawList = await res.json();

                if (!Array.isArray(rawList)) {
                    throw new Error(
                        "Invalid average prices response"
                    );
                }

                const list: AvgItem[] = rawList.map(
                    (item: AvgItem & { price: number | string }) => ({
                        symbol: item.symbol,
                        price: Number(item.price),
                        date: item.date,
                    })
                );

                if (!controller.signal.aborted) {
                    setAvgPrices(list);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error(
                        "Failed to load average prices:",
                        error
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchAveragePrices();

        return () => {
            controller.abort();
        };
    }, []);

    // ===================== BINANCE SYMBOLS =====================

    const symbols = useMemo(() => {
        return avgPrices.map(
            (item) => `${item.symbol.toUpperCase()}USDT`
        );
    }, [avgPrices]);

    // ===================== SHARED WEBSOCKET =====================

    const prices = useBinancePrices(symbols);

    // ===================== CALCULATIONS =====================

    const data = useMemo<CombinedItem[]>(() => {
        return avgPrices.map((item) => {
            const symbol = `${item.symbol.toUpperCase()}USDT`;
            const current = prices[symbol];

            if (
                !Number.isFinite(current) ||
                current <= 0 ||
                !Number.isFinite(item.price) ||
                item.price <= 0
            ) {
                return {
                    ...item,
                    current: null,
                    diffUsd: null,
                    diffPercent: null,
                    status: "neutral",
                };
            }

            const diffUsd = current - item.price;
            const diffPercent =
                (diffUsd / item.price) * 100;

            const status: CombinedItem["status"] =
                diffUsd > 0
                    ? "profit"
                    : diffUsd < 0
                        ? "loss"
                        : "neutral";

            return {
                ...item,
                current,
                diffUsd,
                diffPercent,
                status,
            };
        });
    }, [avgPrices, prices]);

    // ===================== SORTING =====================

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (valA === null && valB === null) return 0;
            if (valA === null) return 1;
            if (valB === null) return -1;

            return sortOrder === "asc"
                ? valA - valB
                : valB - valA;
        });
    }, [data, sortKey, sortOrder]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder((prev) =>
                prev === "asc" ? "desc" : "asc"
            );
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    };

    // ===================== MODAL =====================

    const handleOpenModal = (item: CombinedItem) => {
        setSelectedSymbol(item);
        setIsUpdateOpen(true);
    };

    // ===================== LOADING =====================

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                Loading...
            </div>
        );
    }

    if (!avgPrices.length) {
        return (
            <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                Немає даних
            </div>
        );
    }

    // ===================== RENDER =====================

    return (
        <div className="flex flex-col h-full w-full text-[var(--color-text)]">

            {/* HEADER */}
            <div className="sticky top-0 z-10 flex justify-between bg-[var(--color-card)] px-3 py-2 border-b border-[var(--color-border)] rounded-t-lg select-none">

                <div className="w-[15%] text-left text-sm font-semibold opacity-70">
                    {t.symbol}
                </div>

                <HeaderCell
                    label={t.avgPrice}
                    sortKey="price"
                    activeKey={sortKey}
                    order={sortOrder}
                    onClick={toggleSort}
                />

                <HeaderCell
                    label={t.price}
                    sortKey="current"
                    activeKey={sortKey}
                    order={sortOrder}
                    onClick={toggleSort}
                />

                <HeaderCell
                    label="Δ $"
                    sortKey="diffUsd"
                    activeKey={sortKey}
                    order={sortOrder}
                    onClick={toggleSort}
                />

                <HeaderCell
                    label="Δ %"
                    sortKey="diffPercent"
                    activeKey={sortKey}
                    order={sortOrder}
                    onClick={toggleSort}
                />

                <div className="w-[10%] text-right text-sm font-semibold opacity-70">
                    {t.status}
                </div>
            </div>

            {/* TABLE */}
            <div className="flex flex-col gap-1 overflow-y-auto pr-1 h-[240px] mt-1">

                {sortedData.map((item) => (
                    <div
                        key={item.symbol}
                        className="flex justify-between items-center px-3 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-border)]/10 transition-all duration-150"
                    >

                        {/* SYMBOL */}
                        <div className="flex items-center gap-2 w-[15%] font-semibold">
                            {item.symbol}
                        </div>

                        {/* AVERAGE PRICE */}
                        <div
                            className="w-[20%] text-right text-sm opacity-80 cursor-pointer hover:text-blue-400 transition"
                            onClick={() => handleOpenModal(item)}
                        >
                            {formatPrice(item.price)} $
                        </div>

                        {/* CURRENT PRICE */}
                        <div className="w-[20%] text-right text-sm font-medium">
                            {item.current !== null
                                ? formatPrice(item.current)
                                : "-"} $
                        </div>

                        {/* DIFFERENCE USD */}
                        <div
                            className={`w-[15%] text-right text-sm font-semibold ${
                                item.diffUsd !== null && item.diffUsd > 0
                                    ? "text-green-400"
                                    : item.diffUsd !== null && item.diffUsd < 0
                                        ? "text-red-400"
                                        : "text-gray-400"
                            }`}
                        >
                            {formatDifference(item.diffUsd)}$
                        </div>

                        {/* DIFFERENCE PERCENT */}
                        <div
                            className={`w-[15%] text-right text-sm font-semibold ${
                                item.diffPercent !== null && item.diffPercent > 0
                                    ? "text-green-400"
                                    : item.diffPercent !== null && item.diffPercent < 0
                                        ? "text-red-400"
                                        : "text-gray-400"
                            }`}
                        >
                            {formatDifference(item.diffPercent)}%
                        </div>

                        {/* STATUS */}
                        <div
                            className={`w-[10%] text-right font-bold tracking-wide ${
                                item.status === "profit"
                                    ? "text-green-400"
                                    : item.status === "loss"
                                        ? "text-red-400"
                                        : "text-gray-400"
                            }`}
                        >
                            {item.status === "profit"
                                ? "profit"
                                : item.status === "loss"
                                    ? "loss"
                                    : "-"}
                        </div>
                    </div>
                ))}
            </div>

            {/* UPDATE MODAL */}
            {isUpdateOpen && selectedSymbol && (
                <AvgPriceUpdateModal
                    setIsUpdateOpen={setIsUpdateOpen}
                    symbol={selectedSymbol.symbol}
                    currentPrice={selectedSymbol.price}
                    currentDate={selectedSymbol.date}
                />
            )}
        </div>
    );
}

// ===================== HEADER CELL =====================

function HeaderCell({
                        label,
                        sortKey,
                        activeKey,
                        order,
                        onClick,
                    }: {
    label: string;
    sortKey: SortKey;
    activeKey: SortKey;
    order: SortOrder;
    onClick: (key: SortKey) => void;
}) {
    const isActive = activeKey === sortKey;

    return (
        <div
            className="w-[20%] text-right text-sm font-semibold opacity-70 cursor-pointer flex items-center justify-end gap-1 hover:opacity-100 transition"
            onClick={() => onClick(sortKey)}
        >
            {label}

            <div className="flex flex-col leading-none text-[10px]">
                <ChevronUp
                    size={12}
                    className={
                        isActive && order === "asc"
                            ? "text-green-400"
                            : "opacity-40"
                    }
                />

                <ChevronDown
                    size={12}
                    className={
                        isActive && order === "desc"
                            ? "text-green-400"
                            : "opacity-40"
                    }
                />
            </div>
        </div>
    );
}
