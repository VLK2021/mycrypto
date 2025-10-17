"use client";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en";
import uk from "@/locales/uk";

export default function Sidebar() {
    const { lang } = useLanguage();
    const t = lang === "uk" ? uk : en;

    return (
        <nav className="flex flex-col gap-3">
            <a href="/">{t.home}</a>
            <a href="/trades">{t.trades}</a>
            <a href="/stats">{t.stats}</a>
            <a href="/settings">{t.settings}</a>
        </nav>
    );
}
