"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

export default function TransactionsTable({ transactions, filters, setFilters }: any) {
    const sortableFields = ["date", "price", "amount", "total"];
    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;

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

    // 📱 Мобільний вигляд
    const MobileCardView = ({ tx }: any) => (
        <div
            className="rounded-xl p-3 mb-3 border transition-all duration-200 hover:bg-[var(--color-border)]/10"
            style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
            }}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="text-base font-semibold">{tx.symbol}</div>
                <div
                    className={`text-sm font-semibold ${
                        tx.type === "BUY"
                            ? "text-green-400"
                            : tx.type === "SELL"
                                ? "text-red-400"
                                : "text-gray-400"
                    }`}
                >
                    {tx.type}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div className="opacity-70">{t.price}</div>
                <div>{formatUSD(tx.price)}</div>

                <div className="opacity-70">{t.amount}</div>
                <div>{tx.amount}</div>

                <div className="opacity-70">{t.total}</div>
                <div className="font-semibold text-green-400">{formatUSD(tx.total)}</div>

                <div className="opacity-70">{t.date}</div>
                <div>{new Date(tx.date).toLocaleDateString("uk-UA")}</div>
            </div>
        </div>
    );

    // 💻 Десктопна таблиця
    const DesktopTableView = () => (
        <div
            className="rounded-xl border shadow-sm overflow-hidden transition-colors duration-300 hidden md:block"
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
                        { key: "date", label: t.date || "Date" },
                        { key: "symbol", label: t.symbol || "Symbol" },
                        { key: "price", label: t.price || "Price" },
                        { key: "amount", label: t.amount || "Amount" },
                        { key: "total", label: t.total || "Total" },
                        { key: "type", label: t.type || "Type" },
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
                            className="transition hover:bg-[var(--color-border)]/10"
                            style={{
                                borderBottom: `1px solid var(--color-border)`,
                            }}
                        >
                            <td className="p-3 whitespace-nowrap">
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

    return (
        <>
            {/* 💻 Десктопна таблиця */}
            <DesktopTableView />

            {/* 📱 Мобільні картки */}
            <div className="block md:hidden">
                {transactions.length === 0 ? (
                    <div
                        className="text-center py-6 text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        No transactions found
                    </div>
                ) : (
                    transactions.map((tx: any) => <MobileCardView key={tx.id} tx={tx} />)
                )}
            </div>
        </>
    );
}
