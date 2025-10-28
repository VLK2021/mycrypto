import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            select: {
                type: true,
                amount: true,
                price: true,
            },
        });

        let totalInvested = 0;

        for (const tx of transactions) {
            const value = tx.amount * tx.price;
            if (tx.type === "BUY") totalInvested += value;
            if (tx.type === "SELL") totalInvested -= value;
        }

        return NextResponse.json({ totalInvested });
    } catch (error) {
        console.error("Error fetching total invested:", error);
        return NextResponse.json({ error: "Failed to calculate total invested" }, { status: 500 });
    }
}
