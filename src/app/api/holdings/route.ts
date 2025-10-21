import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Групуємо всі транзакції за символом
        const transactions = await prisma.transaction.findMany({
            select: {
                symbol: true,
                type: true,
                amount: true,
            },
        });

        // Агрегуємо вручну — враховуємо продажі як мінус
        const holdings: Record<string, number> = {};

        for (const tx of transactions) {
            const { symbol, type, amount } = tx;
            if (!holdings[symbol]) holdings[symbol] = 0;
            holdings[symbol] += type === "BUY" ? amount : -amount;
        }

        // Формуємо фінальний масив, фільтруючи монети з нульовим або від’ємним балансом
        const data = Object.entries(holdings)
            .filter(([_, amount]) => amount > 0)
            .map(([symbol, amount]) => ({
                symbol,
                amount,
            }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error("❌ Error fetching holdings:", error);
        return NextResponse.json(
            { error: "Failed to fetch holdings" },
            { status: 500 }
        );
    }
}
