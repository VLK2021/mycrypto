"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Home, List, Wallet2, BarChart3 } from "lucide-react";

export default function NavMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Закриття при кліку поза меню
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const routes = [
        { href: "/", label: "Головна", icon: <Home className="w-4 h-4" /> },
        { href: "/transactions", label: "Транзакції", icon: <List className="w-4 h-4" /> },
        { href: "/portfolio", label: "Портфель", icon: <Wallet2 className="w-4 h-4" /> },
        { href: "/analytics", label: "Аналітика", icon: <BarChart3 className="w-4 h-4" /> },
    ];

    return (
        <div ref={menuRef} className="relative">
            {/* Кнопка меню */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="
          p-2 rounded-md hover:bg-[var(--color-border)]/30
          transition-colors duration-200
        "
                aria-label="Меню навігації"
            >
                {isOpen ? (
                    <X className="w-5 h-5 text-[var(--color-text)]" />
                ) : (
                    <Menu className="w-5 h-5 text-[var(--color-text)]" />
                )}
            </button>

            {/* Випадаюче меню */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="
              absolute right-0 mt-2 w-48 rounded-lg shadow-lg
              bg-[var(--color-card)] border border-[var(--color-border)]
              overflow-hidden z-50
            "
                    >
                        <nav className="flex flex-col py-1">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className="
                    flex items-center gap-2 px-4 py-2 text-sm
                    text-[var(--color-text-muted)]
                    hover:text-[var(--color-text)]
                    hover:bg-[var(--color-border)]/20
                    transition-colors duration-150
                  "
                                    onClick={() => setIsOpen(false)}
                                >
                                    {route.icon}
                                    <span>{route.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
