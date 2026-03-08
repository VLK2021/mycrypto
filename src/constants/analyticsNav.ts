import {
    LayoutDashboard,
    Newspaper,
    Activity,
    LineChart,
    Coins,
    Zap,
    Search
} from "lucide-react";

export const analyticsNav = [
    { icon: LayoutDashboard, label: "Dashboard", route: "/analytics/dashboard" },
    { icon: Newspaper, label: "News", route: "/analytics/news" },
    { icon: Search, label: "Screener", route: "/analytics/screener" },
    { icon: Activity, label: "RSI", route: "/analytics/rsi/information" },
    { icon: LineChart, label: "Market", route: "/analytics/market" },
    { icon: Zap, label: "Liquidations", route: "/analytics/liquidations" },
    { icon: Coins, label: "Asset", route: "/analytics/asset" }

];




