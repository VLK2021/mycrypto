"use client";
import {JSX, useEffect, useState} from "react";
import { TrendingUp, TrendingDown, DollarSign, Coins, PieChart, BarChart3 } from "lucide-react";

interface MetricsData {
    totalMarketCapUsd: number;
    totalVolume24hUsd: number;
    btcDominancePct: number;
    ethDominancePct: number;
    totalExcludingBtcUsd: number;
    totalExcludingBtcEthUsd: number;
    stablecoinCapUsd: number;
    marketCapChange24hPct: number;
    updatedAt: string;
}

export default function MarketMetrics() {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);

    useEffect(() => {
        fetch("/api/metrics")
            .then((res) => res.json())
            .then(setMetrics)
            .catch(console.error);
    }, []);

    if (!metrics)
        return (
            <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
                Loading market data...
            </div>
        );

    const isUp = metrics.marketCapChange24hPct > 0;

    return (
        <div className="bg-secondary border border-border rounded-xl h-[350px] flex flex-col overflow-hidden">
            {/* fixed header */}
            <div className="sticky top-0 z-10 px-4 py-2 border-b border-border bg-secondary flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                    Global Crypto Overview
                </h3>
                <span className="text-xs text-muted-foreground">
          Updated {new Date(metrics.updatedAt).toLocaleTimeString()}
        </span>
            </div>

            {/* scrollable content */}
            <div className="overflow-y-auto px-3 py-4 space-y-4">

                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MetricCard
                        title="Total Market Capitalization"
                        value={`$${(metrics.totalMarketCapUsd / 1e12).toFixed(2)} T`}
                        icon={<BarChart3 className="text-yellow-400" size={18} />}
                        description="All cryptocurrencies combined"
                    />
                    <MetricCard
                        title="Altcoin Market Cap (ex BTC)"
                        value={`$${(metrics.totalExcludingBtcUsd / 1e12).toFixed(2)} T`}
                        icon={<Coins className="text-green-400" size={18} />}
                        description="Total value of all altcoins"
                    />
                    <MetricCard
                        title="Pure Altcoin Cap (ex BTC & ETH)"
                        value={`$${(metrics.totalExcludingBtcEthUsd / 1e12).toFixed(2)} T`}
                        icon={<Coins className="text-purple-400" size={18} />}
                        description="Altcoins without BTC & ETH"
                    />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MetricCard
                        title="Bitcoin Dominance"
                        value={`${metrics.btcDominancePct.toFixed(1)} %`}
                        icon={<PieChart className="text-orange-400" size={18} />}
                        description="Share of BTC in total market"
                    />
                    <MetricCard
                        title="Ethereum Dominance"
                        value={`${metrics.ethDominancePct.toFixed(1)} %`}
                        icon={<PieChart className="text-indigo-400" size={18} />}
                        description="ETH share of market cap"
                    />
                    <MetricCard
                        title="Stablecoin Liquidity"
                        value={`$${(metrics.stablecoinCapUsd / 1e9).toFixed(1)} B`}
                        icon={<DollarSign className="text-emerald-400" size={18} />}
                        description="USDT + USDC combined"
                    />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MetricCard
                        title="24h Trading Volume"
                        value={`$${(metrics.totalVolume24hUsd / 1e9).toFixed(1)} B`}
                        icon={<BarChart3 className="text-sky-400" size={18} />}
                        description="Total crypto market volume"
                    />
                    <MetricCard
                        title="Market Cap Change (24h)"
                        value={
                            <div className={`flex items-center justify-center ${isUp ? "text-green-400" : "text-red-400"}`}>
                                {isUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                                {metrics.marketCapChange24hPct?.toFixed(2)}%
                            </div>
                        }
                        icon={<BarChart3 className={`${isUp ? "text-green-400" : "text-red-400"}`} size={18} />}
                        description={isUp ? "Market grew over last 24h" : "Market declined in 24h"}
                    />
                    <MetricCard
                        title="Altcoin Share"
                        value={`${(100 - metrics.btcDominancePct - metrics.ethDominancePct).toFixed(1)} %`}
                        icon={<PieChart className="text-emerald-400" size={18} />}
                        description="Total market share of all altcoins"
                    />

                </div>

            </div>
        </div>
    );
}

function MetricCard({
                        title,
                        value,
                        icon,
                        description,
                    }: {
    title: string;
    value: string | number | JSX.Element;
    icon?: JSX.Element;
    description?: string;
}) {
    return (
        <div className="bg-card border border-border rounded-lg px-4 py-3 hover:bg-card/80 transition-colors flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{title}</span>
                {icon}
            </div>
            <div className="text-base font-semibold text-foreground text-center">{value}</div>
            {description && (
                <p className="text-[11px] text-muted-foreground mt-1 text-center">
                    {description}
                </p>
            )}
        </div>
    );
}
