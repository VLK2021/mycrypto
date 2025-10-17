"use client";
import { useLanguage } from "@/context/LanguageContext";


export default function LangSwitcher() {
    const { lang, setLang } = useLanguage();

    return (
        <div className="flex gap-2 text-sm">
            <button
                onClick={() => setLang("uk")}
                className={`px-2 py-1 rounded ${lang === "uk" ? "bg-yellow-500 text-black" : "bg-gray-800"}`}
            >
                🇺🇦 УКР
            </button>
            <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded ${lang === "en" ? "bg-yellow-500 text-black" : "bg-gray-800"}`}
            >
                🇬🇧 EN
            </button>
        </div>
    );
}
