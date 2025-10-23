"use client";


export function usePortfolioExposure(portfolio: any[] = [], loading: boolean = false) {
    if (loading || !portfolio.length)
        return { exposure: null, topHighRisk: null, loading };

    const totalValue = portfolio.reduce((acc, p) => acc + p.value, 0);

    // 🔹 Просте правило ризику
    const HIGH_RISK = [
        "Memecoin",
        "AI",
        "NFT",
        "Gaming",
        "Metaverse",
        "Launchpad",
    ];

    const MEDIUM_RISK = [
        "DeFi",
        "Layer 2",
        "DEX",
        "Liquid Staking",
        "Oracle",
        "RWA",
    ];

    const LOW_RISK = [
        "Layer 1",
        "Stablecoin",
        "CEX",
        "Infrastructure",
        "Other",
    ];


    const groups = { high: 0, medium: 0, low: 0 };

    portfolio.forEach((p) => {
        const share = (p.value / totalValue) * 100;

        if (HIGH_RISK.includes(p.category)) groups.high += share;
        else if (MEDIUM_RISK.includes(p.category)) groups.medium += share;
        else groups.low += share;
    });

    // 🔹 Знаходимо монету з найбільшим ризиком (з категорій high)
    const topHighRiskItem = [...portfolio]
        .filter((p) => HIGH_RISK.includes(p.category))
        .sort((a, b) => b.value - a.value)[0];

    const topHighRisk = topHighRiskItem
        ? {
            symbol: topHighRiskItem.symbol,
            percent: topHighRiskItem.percent.toFixed(2),
        }
        : null;

    return {
        exposure: {
            high: groups.high.toFixed(1),
            medium: groups.medium.toFixed(1),
            low: groups.low.toFixed(1),
        },
        topHighRisk,
        loading: false,
    };
}
