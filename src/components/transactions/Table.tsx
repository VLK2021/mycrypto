"use client";

import { ArrowUp, ArrowDown } from "lucide-react";


export default function TransactionsTable({ transactions, filters, setFilters }: any) {
    const sortableFields = ["date", "price", "amount", "total"];

    const handleSort = (field: string) => {
        const isAsc = filters.sortBy === field && filters.order === "asc";
        setFilters({
            ...filters,
            sortBy: field,
            order: isAsc ? "desc" : "asc",
            page: 1,
        });
    };

    const formatUSD = (num: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);


    return (
        <div
            className="rounded-xl border shadow-sm transition-colors duration-300"
            style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
            }}
        >
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                <tr
                    className="border-b text-sm"
                    style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-muted)",
                    }}
                >
                    {[
                        { key: "date", label: "Date" },
                        { key: "symbol", label: "Symbol" },
                        { key: "price", label: "Price" },
                        { key: "amount", label: "Amount" },
                        { key: "total", label: "Total" },
                        { key: "type", label: "Type" },
                    ].map((col) => (
                        <th
                            key={col.key}
                            className={`p-3 select-none ${
                                sortableFields.includes(col.key) ? "cursor-pointer" : ""
                            }`}
                            onClick={() =>
                                sortableFields.includes(col.key) && handleSort(col.key)
                            }
                        >
                            <div className="flex items-center gap-1">
                                {col.label}
                                {sortableFields.includes(col.key) && (
                                    <span className="flex flex-col ml-1 leading-none">
                                        <ArrowUp
                                            className="w-3 h-3"
                                            style={{
                                                color:
                                                    filters.sortBy === col.key &&
                                                    filters.order === "asc"
                                                        ? "var(--color-brand)"
                                                        : "var(--color-text-muted)",
                                            }}
                                        />
                                        <ArrowDown
                                            className="w-3 h-3 -mt-0.5"
                                            style={{
                                                color:
                                                    filters.sortBy === col.key &&
                                                    filters.order === "desc"
                                                        ? "var(--color-brand)"
                                                        : "var(--color-text-muted)",
                                            }}
                                        />
                                    </span>
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {transactions.length === 0 ? (
                    <tr>
                        <td
                            colSpan={6}
                            className="text-center py-6"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            No transactions found
                        </td>
                    </tr>
                ) : (
                    transactions.map((tx: any) => (
                        <tr
                            key={tx.id}
                            className="transition hover:opacity-90"
                            style={{
                                borderBottom: `1px solid var(--color-border)`,
                            }}
                        >
                            <td className="p-3">
                                {new Date(tx.date).toLocaleDateString("uk-UA")}
                            </td>
                            <td className="p-3 font-medium">{tx.symbol}</td>
                            <td className="p-3">{formatUSD(tx.price)}</td>
                            <td className="p-3">{tx.amount}</td>

                            <td
                                className="p-3 font-semibold"
                                style={{
                                    color:
                                        tx.total > 1000
                                            ? "var(--color-success)"
                                            : "var(--color-text)",
                                }}
                            >
                                {formatUSD(tx.total)}
                            </td>

                            <td
                                className="p-3 font-semibold"
                                style={{
                                    color:
                                        tx.type === "BUY"
                                            ? "var(--color-success)"
                                            : "var(--color-error)",
                                }}
                            >
                                {tx.type}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
