"use client";

import { useEffect, useState, useCallback } from "react";
import TransactionsTable from "@/components/transactions/Table";
import FiltersBar from "@/components/transactions/Filters";
import Pagination from "@/components/elements/Pagination";
import { Loader2 } from "lucide-react";

interface Transaction {
    id: number;
    symbol: string;
    type: "BUY" | "SELL";
    amount: number;
    price: number;
    total: number;
    date: string;
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
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        symbol: "",
        type: "",
        sortBy: "date",
        order: "desc",
        search: "",
        page: 1,
        limit: 10,
        dateFrom: "",
        dateTo: "",
    });

    const [meta, setMeta] = useState<Meta>({
        total: 0,
        totalPages: 1,
        page: 1,
        limit: 10,
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
            className="flex flex-col"
            style={{
                backgroundColor: "var(--color-background)",
                color: "var(--color-text)",
            }}
        >
            {/* 🔹 Верхня частина (заголовок + фільтри) */}
            <div
                className="flex-shrink-0 sticky top-0 z-30 px-4 py-3 border-b"
                style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                }}
            >
                <h1 className="text-lg font-semibold mb-2">Transactions</h1>
                <FiltersBar filters={filters} setFilters={setFilters} />
            </div>

            {/* 🔹 Центральна частина (скролювана таблиця) */}
            <div
                className="flex-grow px-4 py-2"
                style={{
                    scrollbarWidth: "thin",
                    maxHeight: "calc(100vh - 200px)", // автоматично враховує висоту верхнього + нижнього блоків
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

            {/* 🔹 Нижня частина (пагінація прижата до низу viewport) */}
            <div
                className="flex-shrink-0 fixed bottom-0 left-0 right-0 z-40 flex justify-center border-t"
                style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                }}
            >
                <Pagination
                    limit={filters.limit}
                    totalItems={meta.total}
                    onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                />
            </div>
        </div>
    );
}
