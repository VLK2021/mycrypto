"use client";

import React, { useEffect, useState } from "react";

export function TotalInvested() {
    const [invested, setInvested] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInvested() {
            try {
                const res = await fetch("/api/invested");
                const json = await res.json();
                setInvested(json.totalInvested || 0);
            } catch (err) {
                console.error("❌ Failed to fetch invested:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchInvested();
    }, []);


    return (
        <div className="w-full">
            <div className="text-sm text-[var(--color-text-muted)]">Total Invested</div>
            <div className="text-2xl font-semibold mt-1 text-green-500">
                {loading ? "Loading..." : `$${invested?.toFixed(2)}`}
            </div>
        </div>
    );
}
