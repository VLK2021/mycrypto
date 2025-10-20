"use client";

import { useEffect, useState, useCallback } from "react";
import TransactionsTable from "@/components/transactions/Table";
import FiltersBar from "@/components/transactions/Filters";
import Pagination from "@/components/elements/Pagination";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";
import TransactionsStats from "@/components/transactions/TransactionsStats";

interface Transaction {
    id: number;
    symbol: string;
    type: "BUY" | "SELL";
    amount: number;
    price: number;
    total: number;
    date: string;
}

interface Stats {
    totalBuy: number;
    totalSell: number;
    count: number;
    net: number;
    avgSize: number;
    avgBuy: number;
    avgSell: number;
}

interface Meta {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    sortBy: string;
    order: string;
    dateFrom?: string;
    dateTo?: string;
    stats?: Stats;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;

    const [filters, setFilters] = useState({
        symbol: "",
        type: "",
        sortBy: "date",
        order: "desc",
        search: "",
        page: 1,
        limit: 8,
        dateFrom: "",
        dateTo: "",
    });

    const [meta, setMeta] = useState<Meta>({
        total: 0,
        totalPages: 1,
        page: 1,
        limit: 8,
        sortBy: "date",
        order: "desc",
    });

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(
                Object.entries(filters)
                    .filter(([_, v]) => v !== "" && v !== undefined && v !== null)
                    .map(([key, value]) => [key, String(value)])
            );

            const res = await fetch(`/api/transactions?${params.toString()}`);
            const json = await res.json();

            setTransactions(json.data || []);
            setMeta(json.meta || meta);
        } catch (err) {
            console.error("❌ Failed to fetch transactions:", err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <div
            className="fixed inset-0 flex flex-col"
            style={{
                backgroundColor: "var(--color-background)",
                color: "var(--color-text)",
                top: "64px",
            }}
        >
            {/* 🔹 Верхня частина (заголовок + фільтри + статистика) */}
            <div
                className="flex-shrink-0 border-b"
                style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                }}
            >
                <div className="px-4 py-1 border-b border-[var(--color-border)]">
                    <h1 className="text-lg font-semibold mb-2">{t.transactions}</h1>
                    <FiltersBar filters={filters} setFilters={setFilters} />
                </div>

                <div className="py-3">
                    <TransactionsStats stats={meta.stats} loading={loading} />
                </div>
            </div>

            {/* 🔹 Центральна частина — тільки вона скролиться */}
            <div
                className="flex-grow px-4 py-2"
                style={{
                    scrollbarWidth: "thin",
                    backgroundColor: "var(--color-background)",
                }}
            >
                {loading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin h-5 w-5 text-[var(--color-text-muted)]" />
                    </div>
                ) : (
                    <TransactionsTable
                        transactions={transactions}
                        filters={filters}
                        setFilters={setFilters}
                    />
                )}
            </div>

            {/* 🔹 Нижня частина (фіксована пагінація) */}
            <div
                className="flex-shrink-0 border-t"
                style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                }}
            >
                <div className="flex justify-center py-2">
                    <Pagination
                        limit={filters.limit}
                        totalItems={meta.total}
                        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                    />
                </div>
            </div>
        </div>
    );
}
