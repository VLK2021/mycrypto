"use client";

import { useEffect, useState } from "react";
import TransactionsTable from "@/components/transactions/Table";
import FiltersBar from "@/components/transactions/Filters";
import { Loader2 } from "lucide-react";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        symbol: "",
        type: "",
        sortBy: "date",
        order: "desc",
        search: "",
        page: 1,
        limit: 10,
    });
    const [meta, setMeta] = useState({ totalPages: 1 });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters as any);
            const res = await fetch(`/api/transactions?${params.toString()}`);
            const json = await res.json();
            setTransactions(json.data || []);
            setMeta(json.meta || {});
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    return (
        <div
            className="p-6 min-h-screen transition-colors duration-300"
            style={{
                backgroundColor: "var(--color-background)",
                color: "var(--color-text)",
            }}
        >
            <h1 className="text-2xl font-semibold mb-6">Transactions</h1>

            <FiltersBar filters={filters} setFilters={setFilters} />

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin h-6 w-6 text-[var(--color-text-muted)]" />
                </div>
            ) : (
                <>
                    <TransactionsTable
                        transactions={transactions}
                        filters={filters}
                        setFilters={setFilters}
                    />

                    <div className="mt-6 flex justify-center">
                        {/*<Pagination*/}
                        {/*    page={filters.page}*/}
                        {/*    totalPages={meta.totalPages}*/}
                        {/*    onPageChange={(page: number) => setFilters({ ...filters, page })}*/}
                        {/*/>*/}
                    </div>
                </>
            )}
        </div>
    );
}
