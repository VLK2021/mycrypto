"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import LangSwitcher from "@/components/LangSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import NavMenu from "@/components/NavMenu";
import BayModal from "@/components/modals/BayModal";
import SellModal from "@/components/modals/SellModal";
import AvgPriceModal from "@/components/modals/AvgPriceModal";
import { useLanguage } from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

export default function Header() {
    const [isBuyOpen, setBuyOpen] = useState(false);
    const [isSellOpen, setSellOpen] = useState(false);
    const [isAvgPriceOpen, setIsAvgPriceOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;

    return (
        <header
            className="
        w-full sticky top-0 z-50
        border-b border-[var(--color-border)]
        bg-[var(--color-background)] text-[var(--color-text)]
        transition-theme px-4 py-3 flex items-center justify-between
      "
        >
            {/* LEFT — Logo + Burger */}
            <div className="flex items-center gap-2">
                {/* Burger icon (mobile only) */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="block lg:hidden p-2 rounded-md hover:bg-[var(--color-border)]/30 transition"
                >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <div className="text-lg sm:text-xl font-bold tracking-wide select-none">
                    {t.logo}
                </div>
            </div>

            {/* CENTER — Action Buttons (desktop only) */}
            <div className="hidden md:flex justify-center gap-3">
                <button
                    className="
            w-[6rem] px-4 py-2 rounded-lg text-sm font-semibold
            bg-[var(--color-success)]/10 text-[var(--color-success)]
            border border-[var(--color-success)]/30
            hover:bg-[var(--color-success)]/20
            transition-colors duration-200
          "
                    onClick={() => setBuyOpen(true)}
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
          "
                    onClick={() => setSellOpen(true)}
                >
                    {t.sell || "SELL"}
                </button>

                <button
                    className="
            w-[6rem] px-4 py-2 rounded-lg text-sm font-semibold
            bg-[var(--color-success)]/10 text-[var(--color-success)]
            border border-[var(--color-success)]/30
            hover:bg-[var(--color-success)]/20
            transition-colors duration-200
          "
                    onClick={() => setIsAvgPriceOpen(true)}
                >
                    {t.price.toLowerCase()}
                </button>
            </div>

            {/* RIGHT — Switchers */}
            <div className="flex items-center gap-3">
                {/* Desktop view */}
                <div className="hidden md:flex items-center gap-3">
                    <NavMenu />

                    {/* FIXED WIDTH FOR LANG SWITCHER */}
                    <div className="w-[65px] flex justify-center">
                        <LangSwitcher />
                    </div>

                    <ThemeSwitcher />
                </div>

                {/* Mobile view */}
                <div className="flex md:hidden items-center gap-2">
                    <div className="w-[65px] flex justify-center">
                        <LangSwitcher />
                    </div>
                    <ThemeSwitcher />
                </div>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {isMenuOpen && (
                <div
                    className="
            absolute left-0 top-full w-full
            bg-[var(--color-card)] border-t border-[var(--color-border)]
            flex flex-col items-center gap-3 py-4 animate-[fadeIn_0.3s_ease]
            md:hidden
          "
                >
                    <button
                        className="
              w-[80%] py-2 rounded-lg font-semibold
              bg-[var(--color-success)]/10 text-[var(--color-success)]
              border border-[var(--color-success)]/30
              hover:bg-[var(--color-success)]/20
            "
                        onClick={() => {
                            setBuyOpen(true);
                            setIsMenuOpen(false);
                        }}
                    >
                        {t.buy}
                    </button>

                    <button
                        className="
              w-[80%] py-2 rounded-lg font-semibold
              bg-[var(--color-error)]/10 text-[var(--color-error)]
              border border-[var(--color-error)]/30
              hover:bg-[var(--color-error)]/20
            "
                        onClick={() => {
                            setSellOpen(true);
                            setIsMenuOpen(false);
                        }}
                    >
                        {t.sell}
                    </button>

                    <button
                        className="
              w-[80%] py-2 rounded-lg font-semibold
              bg-[var(--color-success)]/10 text-[var(--color-success)]
              border border-[var(--color-success)]/30
              hover:bg-[var(--color-success)]/20
            "
                        onClick={() => {
                            setIsAvgPriceOpen(true);
                            setIsMenuOpen(false);
                        }}
                    >
                        {t.price.toLowerCase()}
                    </button>

                    <div className="mt-2 flex gap-3">
                        <NavMenu />
                    </div>
                </div>
            )}

            {/* MODALS */}
            {isBuyOpen && <BayModal setBuyOpen={setBuyOpen} />}
            {isSellOpen && <SellModal setSellOpen={setSellOpen} />}
            {isAvgPriceOpen && <AvgPriceModal setIsAvgPriceOpen={setIsAvgPriceOpen} />}
        </header>
    );
}
