"use client";

import { Search } from "lucide-react";

export default function FiltersBar({ filters, setFilters }: any) {
    return (
        <div
            className="flex flex-wrap items-center gap-4 mb-3 rounded-xl p-4 border transition-all duration-300"
            style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* Search */}
            <div className="relative flex items-center w-64">
                <Search
                    className="absolute left-3 w-5 h-5"
                    style={{ color: "var(--color-text-muted)" }}
                />
                <input
                    type="text"
                    placeholder="Search by symbol..."
                    value={filters.search}
                    onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value.toUpperCase() })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-lg border transition-all duration-200 outline-none focus:ring-2"
                    style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                        boxShadow: "none",
                    }}
                />
            </div>

            {/* Type filter */}
            <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="rounded-lg px-3 py-2 border focus:ring-2 transition-all duration-200"
                style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                }}
            >
                <option value="">All Types</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
            </select>

            {/* Date range filter */}
            <div className="flex items-center gap-2">
                <div>
                    <label className="text-xs text-[var(--color-text-muted)]">From</label>
                    <input
                        type="date"
                        value={filters.dateFrom || ""}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value, page: 1 })}
                        className="rounded-lg px-3 py-2 border text-sm"
                        style={{
                            backgroundColor: "var(--color-background)",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text)",
                        }}
                    />
                </div>

                <div>
                    <label className="text-xs text-[var(--color-text-muted)]">To</label>
                    <input
                        type="date"
                        value={filters.dateTo || ""}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value, page: 1 })}
                        className="rounded-lg px-3 py-2 border text-sm"
                        style={{
                            backgroundColor: "var(--color-background)",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text)",
                        }}
                    />
                </div>
            </div>

        </div>
    );
}
