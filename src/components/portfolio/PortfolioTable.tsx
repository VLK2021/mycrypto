"use client";

import React, {useState, useMemo, useEffect, useRef} from "react";
import {ChevronUp, ChevronDown, Trash2} from "lucide-react";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";
import AvgPriceUpdateModal from "@/components/modals/AvgPriceUpdateModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import {usePortfolioWithCategories} from "@/hooks/usePortfolioWithCategories";
import {usePriceChanges} from "@/hooks/usePriceChanges";


interface PortfolioItem {
    symbol: string;
    name?: string;
    amount: number;
    price: number;
    value: number;
    percent: number;
    category: string;
    avgPrice?: number;
    current?: number;
    diffUsd?: number;
    diffPercent?: number;
}

type SortKey =
    | "symbol"
    | "price"
    | "current"
    | "avgPrice"
    | "diffUsd"
    | "diffPercent"
    | "percent"
    | "change24h";
type SortOrder = "asc" | "desc";


export default function PortfolioTable() {
    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    const {portfolio: basePortfolio, loading} = usePortfolioWithCategories();
    const symbols = useMemo(
        () => basePortfolio.map((p) => `${p.symbol.toUpperCase()}USDT`),
        [basePortfolio]
    );
    const changes = usePriceChanges(symbols);

    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>("percent");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [selected, setSelected] = useState<PortfolioItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<{ symbol: string; name: string } | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectRef = useRef<NodeJS.Timeout | null>(null);
    const fetchedRef = useRef(false);

    // ✅ Завантаження середніх цін
    useEffect(() => {
        if (!basePortfolio.length || fetchedRef.current) return;
        fetchedRef.current = true;

        async function fetchAvg() {
            try {
                const res = await fetch("/api/manual-average-price");
                if (!res.ok) throw new Error("API failed");
                const data = await res.json();

                const avgMap: Record<string, number> = {};
                data.forEach((item: any) => {
                    avgMap[item.symbol.toUpperCase()] = parseFloat(item.price);
                });

                const merged = basePortfolio.map((p) => ({
                    ...p,
                    avgPrice: avgMap[p.symbol.toUpperCase()] || 0,
                    name: fullNames[p.symbol.toUpperCase()] || p.symbol,
                    current: p.price,
                }));

                setPortfolio(merged);
            } catch (err) {
                console.error("❌ Error fetching avg prices:", err);
                setPortfolio(basePortfolio);
            }
        }

        fetchAvg();
    }, [basePortfolio]);

    // ✅ Реальна ціна через Binance WebSocket
    useEffect(() => {
        if (!portfolio.length) return;

        const streams = portfolio.map((x) => `${x.symbol.toLowerCase()}usdt@ticker`).join("/");
        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const payload = message.data;
            if (!payload?.s || !payload?.c) return;

            const symbol = payload.s.replace("USDT", "");
            const current = parseFloat(payload.c);

            setPortfolio((prev) => {
                const updated = prev.map((item) => {
                    if (item.symbol.toUpperCase() === symbol.toUpperCase()) {
                        const diffUsd = current - (item.avgPrice || item.price);
                        const diffPercent = item.avgPrice
                            ? ((current - item.avgPrice) / item.avgPrice) * 100
                            : 0;
                        const newValue = current * item.amount;
                        return {
                            ...item,
                            current,
                            value: newValue,
                            diffUsd,
                            diffPercent,
                        };
                    }
                    return item;
                });

                // 🔹 перерахунок частки портфеля
                const total = updated.reduce((sum, it) => sum + it.value, 0);
                return updated.map((it) => ({
                    ...it,
                    percent: total > 0 ? (it.value / total) * 100 : 0,
                }));
            });
        };

        ws.onerror = (err) => console.warn("⚠️ WebSocket error:", err);

        ws.onclose = () => {
            console.log("🔌 WebSocket closed. Reconnecting...");
            reconnectRef.current = setTimeout(() => {
                wsRef.current = null;
            }, 2000);
        };

        return () => {
            ws.close();
            if (reconnectRef.current) clearTimeout(reconnectRef.current);
        };
    }, [portfolio.length]);

    // 🔹 Сортування
    const sortedData = useMemo(() => {
        return [...portfolio].sort((a, b) => {
            const valA = getSortValue(a, sortKey, changes);
            const valB = getSortValue(b, sortKey, changes);
            return sortOrder === "asc" ? valA - valB : valB - valA;
        });
    }, [portfolio, sortKey, sortOrder, changes]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    };

    const formatNum = (num: number) =>
        num.toFixed(9).replace(/0+$/, "").replace(/\.$/, "");

    if (loading || !portfolio.length) {
        return (
            <div className="flex items-center justify-center h-32 text-[var(--color-text-muted)]">
                Loading portfolio...
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col text-[var(--color-text)]">
            {/* Header */}
            <div
                className="sticky top-0 z-10 grid grid-cols-8 gap-2 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-card)] text-sm font-semibold hidden md:grid">
                <HeaderCell
                    label={t.symbol}
                    sortKey="symbol"
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
                    label="24h %"
                    sortKey="change24h"
                    activeKey={sortKey}
                    order={sortOrder}
                    onClick={toggleSort}
                />
                <HeaderCell
                    label={t.avgPrice}
                    sortKey="avgPrice"
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
                <HeaderCell
                    label="Share"
                    sortKey="percent"
                    activeKey={sortKey}
                    order={sortOrder}
                    onClick={toggleSort}
                />
                <div className="text-right opacity-70">Action</div>
            </div>

            {/* Desktop Rows */}
            <div className="overflow-y-auto max-h-[60vh] custom-scroll hidden md:block">
                {sortedData.map((item) => {
                    const symbolKey = `${item.symbol.toUpperCase()}USDT`;
                    const change24h = changes[symbolKey] ?? 0;
                    const diffUsd = item.diffUsd ?? 0;
                    const diffPercent = item.diffPercent ?? 0;
                    const current = item.current ?? item.price;


                    return (
                        <div
                            key={item.symbol}
                            className="grid grid-cols-8 gap-2 px-4 py-2 border-b border-[var(--color-border)] items-center hover:bg-[var(--color-border)]/10 transition"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <span className="font-semibold">{item.symbol}</span>
                                    <div className="flex items-center gap-2 text-xs opacity-70">
                                        <span>{item.name}</span>
                                        {item.category && (
                                            <span
                                                className="px-2 py-[2px] rounded-full bg-[var(--color-border)]/30 text-[10px] uppercase tracking-wide">
          {item.category}
        </span>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div className="text-right">
                                <div className="text-sm font-medium">${formatNum(current)}</div>
                                <div className="text-xs opacity-70">${(current * item.amount).toFixed(2)}</div>
                            </div>

                            <div
                                className={`text-right text-sm font-semibold ${
                                    change24h > 0
                                        ? "text-green-500"
                                        : change24h < 0
                                            ? "text-red-500"
                                            : "text-[var(--color-text-muted)]"
                                }`}
                            >
                                {change24h > 0 ? "+" : ""}
                                {change24h.toFixed(2)}%
                            </div>

                            <div
                                className="text-right text-sm cursor-pointer hover:text-blue-400 transition"
                                onClick={() => setSelected(item)}
                            >
                                {item.avgPrice ? (
                                    <>
                                        <div>${formatNum(item.avgPrice)}</div>
                                        <div className="text-xs opacity-70">
                                            {(item.avgPrice * item.amount).toFixed(2)}$
                                        </div>
                                    </>
                                ) : (
                                    "-"
                                )}
                            </div>


                            {/* Δ $ */}
                            <div className={`text-right text-sm font-semibold ${getColor(diffUsd)}`}>
                                <div>
                                    {diffUsd > 0 ? "+" : ""}
                                    {formatNum(diffUsd)}$
                                </div>

                                {/* 🔹 різниця загальної вартості (diffUsd * amount) */}
                                <div
                                    className={`text-xs mt-[1px] ${
                                        diffUsd > 0
                                            ? "text-green-400/70"
                                            : diffUsd < 0
                                                ? "text-red-400/70"
                                                : "text-gray-400/70"
                                    }`}
                                >
                                    {diffUsd > 0 ? "+" : ""}
                                    {(diffUsd * item.amount).toFixed(2)}$
                                </div>
                            </div>


                            <div className={`text-right text-sm font-semibold ${getColor(diffPercent)}`}>
                                {diffPercent > 0 ? "+" : ""}
                                {diffPercent.toFixed(2)}%
                            </div>

                            <div className="text-right text-sm font-semibold">{item.percent.toFixed(2)}%</div>

                            <div className="flex justify-end">
                                <button
                                    className="p-1 rounded-md hover:bg-red-500/10 transition"
                                    onClick={() =>
                                        setDeleteItem({symbol: item.symbol, name: item.name || item.symbol})
                                    }
                                >
                                    <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500"/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 🔹 Mobile Cards */}
            <div className="flex flex-col gap-3 mt-2 md:hidden">
                {sortedData.map((item) => {
                    const symbolKey = `${item.symbol.toUpperCase()}USDT`;
                    const change24h = changes[symbolKey] ?? 0;
                    const diffUsd = item.diffUsd ?? 0;
                    const diffPercent = item.diffPercent ?? 0;
                    const current = item.current ?? item.price;

                    return (
                        <div
                            key={item.symbol}
                            className="border border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-card)] shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <div className="font-semibold text-lg">{item.symbol}</div>
                                    <div className="text-xs opacity-70">{item.name}</div>
                                </div>
                                <button
                                    className="p-1 rounded-md hover:bg-red-500/10 transition"
                                    onClick={() =>
                                        setDeleteItem({symbol: item.symbol, name: item.name || item.symbol})
                                    }
                                >
                                    <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500"/>
                                </button>
                            </div>

                            <div className="text-sm space-y-1">
                                <div>Current: ${formatNum(current)}</div>

                                {/* ✅ Тепер середня ціна клікабельна */}
                                <div
                                    className="cursor-pointer hover:text-blue-400 transition"
                                    onClick={() => setSelected(item)}
                                >
                                    Avg: {item.avgPrice ? `$${formatNum(item.avgPrice)}` : "-"}
                                </div>

                                <div className={getColor(diffUsd)}>Δ $: {diffUsd.toFixed(2)}$</div>
                                <div className={getColor(diffPercent)}>Δ %: {diffPercent.toFixed(2)}%</div>
                                <div
                                    className={`${
                                        change24h > 0 ? "text-green-500" : change24h < 0 ? "text-red-500" : "text-gray-400"
                                    }`}
                                >
                                    24h: {change24h > 0 ? "+" : ""}
                                    {change24h.toFixed(2)}%
                                </div>
                                <div>Share: {item.percent.toFixed(2)}%</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 🟣 Modals */}
            {selected && (
                <AvgPriceUpdateModal
                    setIsUpdateOpen={() => setSelected(null)}
                    symbol={selected.symbol}
                    currentPrice={selected.avgPrice || 0}
                    currentDate={new Date().toISOString()}
                />
            )}
            {deleteItem && (
                <ConfirmDeleteModal
                    symbol={deleteItem.symbol}
                    name={deleteItem.name}
                    onCancel={() => setDeleteItem(null)}
                    onConfirm={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}

function HeaderCell({label, sortKey, activeKey, order, onClick}: any) {
    const isActive = activeKey === sortKey;
    return (
        <div
            className="flex items-center justify-end gap-1 cursor-pointer select-none hover:opacity-100 transition opacity-70 text-sm"
            onClick={() => onClick(sortKey)}
        >
            {label}
            <div className="flex flex-col leading-none">
                <ChevronUp size={12} className={`${isActive && order === "asc" ? "text-green-400" : "opacity-40"}`}/>
                <ChevronDown size={12} className={`${isActive && order === "desc" ? "text-green-400" : "opacity-40"}`}/>
            </div>
        </div>
    );
}


function getSortValue(item: PortfolioItem, key: SortKey, changes: Record<string, number>): number {
    switch (key) {
        case "current":
            return item.current ?? item.price;
        case "change24h":
            return changes[`${item.symbol.toUpperCase()}USDT`] ?? 0;
        case "diffUsd":
            return item.diffUsd ?? 0;
        case "diffPercent":
            return item.diffPercent ?? 0;
        default:
            return (item as any)[key] ?? 0;
    }
}


function getColor(value: number): string {
    return value > 0 ? "text-green-400" : value < 0 ? "text-red-400" : "text-gray-400";
}

const fullNames: Record<string, string> = {
    BTC: "Bitcoin",
    OP: "Optimism",
    LDO: "Lido Finance",
    ETH: "Ethereum",
    SOL: "Solana",
    XRP: "Ripple",
    BNB: "Binance Coin",
    ADA: "Cardano",
    DOGE: "Dogecoin",
    PEPE: "Pepe",
    BONK: "Bonk",
    JUP: "Jupiter",
    W: "Wormhole",
    PUMP: "Pump.fun",
};
