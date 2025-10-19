import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { symbol, amount, price, date } = await req.json();

        const amountNum = parseFloat(amount);
        const priceNum = parseFloat(price);
        const total = amountNum * priceNum;

        if (!symbol || isNaN(amountNum) || isNaN(priceNum) || !date) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const transaction = await prisma.transaction.create({
            data: {
                symbol,
                type: "SELL",
                amount: amountNum,
                price: priceNum,
                total,
                date: new Date(date),
            },
        });

        console.log("✅ Saved SELL transaction:", transaction);
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("❌ Error creating SELL transaction:", error);
        return NextResponse.json(
            { error: "Failed to create SELL transaction" },
            { status: 500 }
        );
    }
}
