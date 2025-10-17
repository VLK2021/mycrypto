"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Language = "uk" | "en";

type LangContextType = {
    lang: Language;
    setLang: (lang: Language) => void;
};


const LanguageContext = createContext<LangContextType | undefined>(undefined);


export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Language>("uk");

    // Зберігаємо вибір у localStorage
    useEffect(() => {
        const saved = localStorage.getItem("lang") as Language | null;
        if (saved) setLang(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
};
