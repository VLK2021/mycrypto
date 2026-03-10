"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {analyticsNav} from "@/constants/analyticsNav";


type NavItem = {
    icon: any;
    label: string;
    route: string;
};


export default function AnalyticsHeader() {
    const pathname = usePathname();

    const isActive = (route: string) => {
        return pathname === route || pathname.startsWith(route + "/");
    };


    return (
        <div className="w-full border-b border-[var(--color-border)] pb-3">
            <div className="flex md:block overflow-x-auto custom-scroll">
                <div
                    className="
                        flex md:grid
                        gap-2 md:gap-3
                        min-w-max md:min-w-0
                        md:grid-cols-[repeat(auto-fit,minmax(110px,1fr))]
                        items-stretch
                    "
                >
                    {analyticsNav.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.route);

                        return (
                            <Link
                                key={item.route}
                                href={item.route}
                                className={`
                                    group
                                    flex md:flex-col items-center justify-center
                                    gap-2 md:gap-1
                                    px-3 md:px-2 py-2
                                    rounded-xl
                                    border border-transparent
                                    transition
                                    min-w-[110px] md:min-w-0
                                    ${
                                    active
                                        ? "bg-blue-500/15 text-blue-300 border-blue-500/20"
                                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
                                }
                                `}
                            >
                                <Icon
                                    size={20}
                                    className={
                                        active
                                            ? "text-blue-300"
                                            : "opacity-90 group-hover:opacity-100"
                                    }
                                />

                                <span
                                    className={`
                                        text-xs font-medium
                                        ${
                                        active
                                            ? "text-blue-300"
                                            : "opacity-80 group-hover:opacity-100"
                                    }
                                    `}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
