"use client";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";


export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();


    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
        >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}
