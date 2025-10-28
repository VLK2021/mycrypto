import { NextResponse } from "next/server";

import {prisma} from "@/lib/prisma";


export async function GET() {
    try {
        // Отримуємо всі транзакції (символ, тип, кількість)
        const transactions = await prisma.transaction.findMany({
            select: {
                symbol: true,
                type: true,
                amount: true,
            },
        });

        // Агрегуємо вручну — продажі вважаємо від’ємними
        const holdings: Record<string, number> = {};

        for (const tx of transactions) {
            const { symbol, type, amount } = tx;
            if (!holdings[symbol]) holdings[symbol] = 0;
            holdings[symbol] += type === "BUY" ? amount : -amount;
        }

        // Формуємо фінальний масив, фільтруючи монети з позитивним балансом
        const data = Object.entries(holdings)
            .filter(([_, amount]) => amount > 0)
            .map(([symbol, amount]) => ({
                symbol,
                amount,
            }));

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching holdings:", error);
        return NextResponse.json(
            { error: "Failed to fetch holdings" },
            { status: 500 }
        );
    }
}
