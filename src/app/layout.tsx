import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";

import "./globals.css";
import {LanguageProvider, ThemeProvider} from "@/context";
import Header from "@/components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Crypto",
    description: "Crypto create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased w-full bg-[var(--color-background)] text-[var(--color-text)] transition-theme`}
        >

        <ThemeProvider>
            <LanguageProvider>
                <Header/>

                <main className="w-full">
                    {children}
                </main>
            </LanguageProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
