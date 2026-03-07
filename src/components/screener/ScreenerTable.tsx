// "use client";
//
// import { useScreener } from "@/hooks/useScreener";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
//
// type SortKey = "symbol" | "price" | "change24h" | "volume" | "openInterest" | "funding";
// type SortOrder = "asc" | "desc";
//
// interface Coin {
//     symbol: string;
//     price: number;
//     change24h: number;
//     volume: number;
//     openInterest: number;
//     funding: number;
// }
//
// export default function ScreenerTable() {
//     const { data, loading } = useScreener();
//
//     const [search, setSearch] = useState("");
//     const [externalCoin, setExternalCoin] = useState<Coin | null>(null);
//
//     const [sortKey, setSortKey] = useState<SortKey>("volume");
//     const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//
//     function toggleSort(key: SortKey) {
//         if (sortKey === key) {
//             setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//         } else {
//             setSortKey(key);
//             setSortOrder("desc");
//         }
//     }
//
//     const filteredData = useMemo(() => {
//         const source: Coin[] = data as Coin[];
//
//         if (!search.trim()) return source;
//
//         return source.filter((coin) =>
//             coin.symbol.replace("USDT", "").toLowerCase().includes(search.toLowerCase())
//         );
//     }, [data, search]);
//
//     // якщо монету не знайдено серед топ-150 — беремо її з Binance
//     useEffect(() => {
//         async function fetchCoin() {
//             if (!search.trim()) {
//                 setExternalCoin(null);
//                 return;
//             }
//
//             if (filteredData.length > 0) {
//                 setExternalCoin(null);
//                 return;
//             }
//
//             const symbol = search.toUpperCase() + "USDT";
//
//             try {
//                 const [tickerRes, fundingRes, oiRes] = await Promise.all([
//                     fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`),
//                     fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`),
//                     fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}`)
//                 ]);
//
//                 if (!tickerRes.ok) {
//                     setExternalCoin(null);
//                     return;
//                 }
//
//                 const ticker = await tickerRes.json();
//                 const funding = await fundingRes.json();
//                 const oi = await oiRes.json();
//
//                 const coin: Coin = {
//                     symbol: ticker.symbol,
//                     price: Number(ticker.lastPrice),
//                     change24h: Number(ticker.priceChangePercent),
//                     volume: Number(ticker.quoteVolume),
//                     openInterest: Number(oi.openInterest),
//                     funding: Number(funding.lastFundingRate)
//                 };
//
//                 setExternalCoin(coin);
//             } catch {
//                 setExternalCoin(null);
//             }
//         }
//
//         fetchCoin();
//     }, [search, filteredData]);
//
//     const tableData = useMemo(() => {
//         const source: Coin[] =
//             filteredData.length > 0
//                 ? filteredData
//                 : externalCoin
//                     ? [externalCoin]
//                     : [];
//
//         return [...source].sort((a, b) => {
//             if (sortKey === "symbol") {
//                 return sortOrder === "asc"
//                     ? a.symbol.localeCompare(b.symbol)
//                     : b.symbol.localeCompare(a.symbol);
//             }
//
//             const valA = Number(a[sortKey]) || 0;
//             const valB = Number(b[sortKey]) || 0;
//
//             return sortOrder === "asc" ? valA - valB : valB - valA;
//         });
//     }, [filteredData, externalCoin, sortKey, sortOrder]);
//
//     if (loading) {
//         return (
//             <div className="w-full flex justify-center py-10 text-[var(--color-text-muted)]">
//                 Loading screener...
//             </div>
//         );
//     }
//
//     return (
//         <div className="w-full flex flex-col gap-3">
//
//             <input
//                 placeholder="Search coin (BTC, ETH, SOL...)"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] outline-none"
//             />
//
//             <div className="w-full h-[70vh] overflow-auto border border-[var(--color-border)] rounded-xl">
//                 <table className="min-w-[700px] w-full text-sm">
//
//                     <thead className="sticky top-0 z-10 bg-[var(--color-background)] border-b border-[var(--color-border)]">
//                     <tr className="text-left text-[var(--color-text-muted)]">
//
//                         <HeaderCell label="Монета" sortKey="symbol" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
//                         <HeaderCell label="Ціна" sortKey="price" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
//                         <HeaderCell label="24h %" sortKey="change24h" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
//                         <HeaderCell label="Обʼєм" sortKey="volume" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
//                         <HeaderCell label="OI" sortKey="openInterest" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
//                         <HeaderCell label="Funding" sortKey="funding" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
//
//                     </tr>
//                     </thead>
//
//                     <tbody>
//
//                     {tableData.map((coin) => {
//
//                         const changePositive = coin.change24h >= 0;
//                         const fundingPositive = coin.funding >= 0;
//
//                         return (
//                             <tr key={coin.symbol} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/40 transition">
//
//                                 <td className="px-4 py-3">
//                                     <div className="flex items-center gap-2">
//                                         <div className="text-yellow-400 text-sm">✦</div>
//
//                                         <div className="flex items-baseline gap-1">
//                         <span className="font-semibold text-[var(--color-text)]">
//                           {coin.symbol.replace("USDT", "")}
//                         </span>
//
//                                             <span className="text-[var(--color-text-muted)] text-sm">
//                           USDT
//                         </span>
//                                         </div>
//                                     </div>
//                                 </td>
//
//                                 <td className="px-4 py-3">
//                                     ${coin.price.toLocaleString()}
//                                 </td>
//
//                                 <td className={`px-4 py-3 font-medium ${changePositive ? "text-green-400" : "text-red-400"}`}>
//                                     {coin.change24h.toFixed(2)}%
//                                 </td>
//
//                                 <td className="px-4 py-3">
//                                     ${(coin.volume / 1e9).toFixed(2)}B
//                                 </td>
//
//                                 <td className="px-4 py-3">
//                                     ${(coin.openInterest * coin.price / 1e9).toFixed(2)}B
//                                 </td>
//
//                                 <td className={`px-4 py-3 font-medium ${fundingPositive ? "text-green-400" : "text-red-400"}`}>
//                                     {(coin.funding * 100).toFixed(4)}%
//                                 </td>
//
//                             </tr>
//                         );
//                     })}
//
//                     </tbody>
//
//                 </table>
//             </div>
//
//         </div>
//     );
// }
//
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
//
//     return (
//         <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => onClick(sortKey)}>
//             <div className="flex items-center gap-1">
//
//                 {label}
//
//                 <div className="flex flex-col leading-none">
//                     <ChevronUp size={12} className={isActive && order === "asc" ? "text-green-400" : "opacity-40"} />
//                     <ChevronDown size={12} className={isActive && order === "desc" ? "text-green-400" : "opacity-40"} />
//                 </div>
//
//             </div>
//         </th>
//     );
// }







"use client";

import { useScreener } from "@/hooks/useScreener";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SortKey =
    | "symbol"
    | "price"
    | "change24h"
    | "volume"
    | "openInterest"
    | "funding"
    | "rsi1h"
    | "rsi4h";

type SortOrder = "asc" | "desc";

interface Coin {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    openInterest: number;
    funding: number;
    rsi1h: number;
    rsi4h: number;
}

export default function ScreenerTable() {

    const { data, loading } = useScreener();

    const [search, setSearch] = useState("");
    const [externalCoin, setExternalCoin] = useState<Coin | null>(null);

    const [sortKey, setSortKey] = useState<SortKey>("volume");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    }

    function getRsiColor(value: number) {
        if (value <= 30) return "text-green-400";
        if (value >= 70) return "text-red-400";
        return "text-[var(--color-text)]";
    }


    const filteredData = useMemo(() => {

        const source: Coin[] = data as Coin[];

        if (!search.trim()) return source;

        return source.filter(coin =>
            coin.symbol.replace("USDT", "").toLowerCase().includes(search.toLowerCase())
        );

    }, [data, search]);

    useEffect(() => {

        async function fetchCoin() {

            if (!search.trim()) {
                setExternalCoin(null);
                return;
            }

            if (filteredData.length > 0) {
                setExternalCoin(null);
                return;
            }

            const symbol = search.toUpperCase() + "USDT";

            try {

                const [tickerRes, fundingRes, oiRes] = await Promise.all([
                    fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`),
                    fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`),
                    fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}`)
                ]);

                if (!tickerRes.ok) {
                    setExternalCoin(null);
                    return;
                }

                const ticker = await tickerRes.json();
                const funding = await fundingRes.json();
                const oi = await oiRes.json();

                const coin: Coin = {
                    symbol: ticker.symbol,
                    price: Number(ticker.lastPrice),
                    change24h: Number(ticker.priceChangePercent),
                    volume: Number(ticker.quoteVolume),
                    openInterest: Number(oi.openInterest),
                    funding: Number(funding.lastFundingRate),
                    rsi1h: 0,
                    rsi4h: 0
                };

                setExternalCoin(coin);

            } catch {
                setExternalCoin(null);
            }

        }

        fetchCoin();

    }, [search, filteredData]);

    const tableData = useMemo(() => {

        const source: Coin[] =
            filteredData.length > 0
                ? filteredData
                : externalCoin
                    ? [externalCoin]
                    : [];

        return [...source].sort((a, b) => {

            if (sortKey === "symbol") {
                return sortOrder === "asc"
                    ? a.symbol.localeCompare(b.symbol)
                    : b.symbol.localeCompare(a.symbol);
            }

            const valA = Number(a[sortKey]) || 0;
            const valB = Number(b[sortKey]) || 0;

            return sortOrder === "asc" ? valA - valB : valB - valA;

        });

    }, [filteredData, externalCoin, sortKey, sortOrder]);

    if (loading) {
        return (
            <div className="w-full flex justify-center py-10 text-[var(--color-text-muted)]">
                Loading screener...
            </div>
        );
    }

    return (

        <div className="w-full flex flex-col gap-3">

            <input
                placeholder="Search coin (BTC, ETH, SOL...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] outline-none"
            />

            <div className="w-full h-[70vh] overflow-auto border border-[var(--color-border)] rounded-xl">

                <table className="min-w-[900px] w-full text-sm">

                    <thead className="sticky top-0 z-10 bg-[var(--color-background)] border-b border-[var(--color-border)]">

                    <tr className="text-left text-[var(--color-text-muted)]">

                        <HeaderCell label="Монета" sortKey="symbol" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
                        <HeaderCell label="Ціна" sortKey="price" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
                        <HeaderCell label="24h %" sortKey="change24h" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
                        <HeaderCell label="Обʼєм" sortKey="volume" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
                        <HeaderCell label="OI" sortKey="openInterest" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
                        <HeaderCell label="Funding" sortKey="funding" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
                        <HeaderCell label="RSI 1H" sortKey="rsi1h" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>
                        <HeaderCell label="RSI 4H" sortKey="rsi4h" activeKey={sortKey} order={sortOrder} onClick={toggleSort}/>

                    </tr>

                    </thead>

                    <tbody>

                    {tableData.map((coin) => {

                        const changePositive = coin.change24h >= 0;
                        const fundingPositive = coin.funding >= 0;

                        return (

                            <tr key={coin.symbol} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/40 transition">

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="text-yellow-400 text-sm">✦</div>

                                        <div className="flex items-baseline gap-1">
                                            <span className="font-semibold text-[var(--color-text)]">
                                                {coin.symbol.replace("USDT", "")}
                                            </span>

                                            <span className="text-[var(--color-text-muted)] text-sm">
                                                USDT
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-3">${coin.price.toLocaleString()}</td>

                                <td className={`px-4 py-3 font-medium ${changePositive ? "text-green-400" : "text-red-400"}`}>
                                    {coin.change24h.toFixed(2)}%
                                </td>

                                <td className="px-4 py-3">
                                    ${(coin.volume / 1e9).toFixed(2)}B
                                </td>

                                <td className="px-4 py-3">
                                    ${(coin.openInterest * coin.price / 1e9).toFixed(2)}B
                                </td>

                                <td className={`px-4 py-3 font-medium ${fundingPositive ? "text-green-400" : "text-red-400"}`}>
                                    {(coin.funding * 100).toFixed(4)}%
                                </td>

                                <td className={`px-4 py-3 font-medium ${getRsiColor(coin.rsi1h)}`}>
                                    {coin.rsi1h.toFixed(1)}
                                </td>

                                <td className={`px-4 py-3 font-medium ${getRsiColor(coin.rsi4h)}`}>
                                    {coin.rsi4h.toFixed(1)}
                                </td>


                            </tr>

                        );

                    })}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

function HeaderCell({
                        label,
                        sortKey,
                        activeKey,
                        order,
                        onClick
                    }: any) {

    const isActive = activeKey === sortKey;

    return (
        <th
            className="px-4 py-3 font-medium cursor-pointer select-none"
            onClick={() => onClick(sortKey)}
        >
            <div className="flex items-center gap-1">

                {label}

                <div className="flex flex-col leading-none">

                    <ChevronUp
                        size={12}
                        className={isActive && order === "asc" ? "text-green-400" : "opacity-40"}
                    />

                    <ChevronDown
                        size={12}
                        className={isActive && order === "desc" ? "text-green-400" : "opacity-40"}
                    />

                </div>

            </div>
        </th>
    );
}
