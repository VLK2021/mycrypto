"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function RsiHeader() {

    const pathname = usePathname();

    const tabs = [
        { label: "Information", route: "/analytics/rsi/information" },
        { label: "Oversold", route: "/analytics/rsi/oversold" },
        { label: "Overbought", route: "/analytics/rsi/overbought" },
    ];

    return (
        <div className="flex gap-8 border-b border-[var(--color-border)] pb-2 px-1 md:px-6">

            {tabs.map((tab) => {

                const active =
                    pathname === tab.route ||
                    (tab.route !== "/analytics/rsi/information" && pathname.startsWith(tab.route));

                return (
                    <Link
                        key={tab.route}
                        href={tab.route}
                        className={`text-sm font-medium transition ${
                            active
                                ? "text-blue-400"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}