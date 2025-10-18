"use client";

import LangSwitcher from "@/components/LangSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useLanguage } from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

export default function Header() {
    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;


    return (
        <header
            className="
                w-full
                flex items-center
                px-6 py-4
                border-b border-[var(--color-border)]
                bg-[var(--color-background)]
                text-[var(--color-text)]
                transition-theme
                sticky top-0 z-50
            "
        >
            <div className="basis-[20%] min-w-[150px] flex justify-start">
                <div className="text-xl font-bold tracking-wide select-none">
                    {t.logo}
                </div>
            </div>

            <div className="basis-[50%] flex justify-center gap-4">
                <button
                    className="
                        w-[6rem] px-4 py-2 rounded-lg text-sm font-semibold
                        bg-[var(--color-success)]/10 text-[var(--color-success)]
                        border border-[var(--color-success)]/30
                        hover:bg-[var(--color-success)]/20
                        transition-colors duration-200
                        text-center
                    "
                >
                    {t.buy || "BUY"}
                </button>

                <button
                    className="
                        w-[6rem] px-4 py-2 rounded-lg text-sm font-semibold
                        bg-[var(--color-error)]/10 text-[var(--color-error)]
                        border border-[var(--color-error)]/30
                        hover:bg-[var(--color-error)]/20
                        transition-colors duration-200
                        text-center
                    "
                >
                    {t.sell || "SELL"}
                </button>
            </div>

            <div className="basis-[30%] flex justify-end items-center gap-3 min-w-[150px]">
                <LangSwitcher />
                <ThemeSwitcher />
            </div>
        </header>
    );
}
