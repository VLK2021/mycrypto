import { NextResponse } from "next/server";

type CoinMarket = {
    id: string;
    symbol: string;
    name: string;
    market_cap: number | null;
    current_price?: number;
    total_volume?: number;
};

export async function GET() {
    try {
        // Cache / revalidate one minute (можеш змінити)
        const fetchOpts: RequestInit = { next: { revalidate: 60 } };

        // 1) Global summary (total market cap, total volume, dominance %)
        const globalRes = await fetch("https://api.coingecko.com/api/v3/global", fetchOpts);
        if (!globalRes.ok) throw new Error(`CoinGecko /global failed: ${globalRes.status}`);
        const globalJson = await globalRes.json();

        // safe access
        const totalMarketCapUsd: number =
            (globalJson && globalJson.data && globalJson.data.total_market_cap && globalJson.data.total_market_cap.usd) || 0;

        const totalVolume24hUsd: number =
            (globalJson && globalJson.data && globalJson.data.total_volume && globalJson.data.total_volume.usd) || 0;

        const marketCapPct = (globalJson && globalJson.data && globalJson.data.market_cap_percentage) || {};
        const btcDominancePct: number = marketCapPct.btc ?? 0;
        const ethDominancePct: number = marketCapPct.eth ?? 0;

        // 2) Fetch specific coins (bitcoin, ethereum, tether, usd-coin) to get exact market_cap values
        // CoinGecko 'coins/markets' endpoint (vs_currency=usd). No API key required.
        const ids = ["bitcoin", "ethereum", "tether", "usd-coin"].join(",");
        const coinsRes = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids)}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
            fetchOpts
        );
        if (!coinsRes.ok) {
            // if coin-specific request fails, we will fallback to computing by dominance %
            console.warn("CoinGecko coins/markets failed:", coinsRes.status);
        }
        const coinsJson: CoinMarket[] = (await coinsRes.json().catch(() => [])) || [];

        const findCap = (id: string) => {
            const item = coinsJson.find((c) => c.id === id);
            return (item && (item.market_cap ?? 0)) || 0;
        };

        // Prefer exact market caps from coins/markets; fallback to using global * dominance% if missing
        const btcMarketCap = findCap("bitcoin") || (totalMarketCapUsd * (btcDominancePct / 100));
        const ethMarketCap = findCap("ethereum") || (totalMarketCapUsd * (ethDominancePct / 100));
        const tetherMarketCap = findCap("tether") || 0;
        const usdcMarketCap = findCap("usd-coin") || 0;

        // 3) Derived metrics
        // TOTAL (full) — use CoinGecko global
        const TOTAL = totalMarketCapUsd; // in USD

        // TOTAL2 = TOTAL - BTC
        const TOTAL2 = Math.max(TOTAL - btcMarketCap, 0);

        // TOTAL3 = TOTAL - BTC - ETH
        const TOTAL3 = Math.max(TOTAL - btcMarketCap - ethMarketCap, 0);

        // Stablecoin cap (simple sum of USDT + USDC)
        const stablecoinCap = tetherMarketCap + usdcMarketCap;

        // 4) Other helpful fields from global object (market_cap_change_percentage_24h_usd etc.)
        const marketCapChange24hPct =
            (globalJson && globalJson.data && globalJson.data.market_cap_change_percentage_24h_usd) ?? null;

        // 5) Response object
        const payload = {
            // raw USD values
            totalMarketCapUsd: TOTAL,
            totalVolume24hUsd: totalVolume24hUsd,
            btcMarketCapUsd: btcMarketCap,
            ethMarketCapUsd: ethMarketCap,
            totalExcludingBtcUsd: TOTAL2,
            totalExcludingBtcEthUsd: TOTAL3,
            stablecoinCapUsd: stablecoinCap,

            // percentages
            btcDominancePct,
            ethDominancePct,
            marketCapChange24hPct,

            // helpful metadata
            coinGeckoGlobal: globalJson?.data ? true : false,
            coinsFetched: coinsJson.map((c) => ({ id: c.id, market_cap: c.market_cap })),

            // sources for frontend display/troubleshooting
            sources: {
                coinGeckoGlobal: "https://api.coingecko.com/api/v3/global",
                coinGeckoCoinsMarkets: `https://api.coingecko.com/api/v3/coins/markets?ids=bitcoin,ethereum,tether,usd-coin`,
            },

            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(payload);
    } catch (err) {
        console.error("Error in /api/metrics:", err);
        return NextResponse.json({ error: "Failed to collect metrics", details: String(err) }, { status: 500 });
    }
}
