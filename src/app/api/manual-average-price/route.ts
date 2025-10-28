import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    try {
        const { symbol, price, date } = await req.json();

        if (!symbol || !price || !date) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const avgPrice = await prisma.manualAveragePrice.create({
            data: {
                symbol,
                price,
                date: new Date(date),
            },
        });

        return NextResponse.json(avgPrice, { status: 201 });
    } catch (error) {
        console.error("❌ Prisma POST error:", error);
        return NextResponse.json(
            { error: "Failed to create record" },
            { status: 500 }
        );
    }
}


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const symbol = searchParams.get("symbol");

        if (symbol) {
            // повернути конкретний запис
            const record = await prisma.manualAveragePrice.findUnique({
                where: { symbol },
            });
            if (!record)
                return NextResponse.json(
                    { error: "Record not found" },
                    { status: 404 }
                );
            return NextResponse.json(record, { status: 200 });
        } else {
            // повернути всі записи
            const all = await prisma.manualAveragePrice.findMany({
                orderBy: { createdAt: "desc" },
            });
            return NextResponse.json(all, { status: 200 });
        }
    } catch (error) {
        console.error("❌ Prisma GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch records" },
            { status: 500 }
        );
    }
}


export async function PUT(req: Request) {
    try {
        const { symbol, price, date } = await req.json();

        if (!symbol) {
            return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
        }

        const updated = await prisma.manualAveragePrice.update({
            where: { symbol },
            data: {
                ...(price && { price }),
                ...(date && { date: new Date(date) }),
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("❌ Prisma PUT error:", error);
        return NextResponse.json(
            { error: "Failed to update record" },
            { status: 500 }
        );
    }
}


export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const symbol = searchParams.get("symbol");

        if (!symbol) {
            return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
        }

        const deleted = await prisma.manualAveragePrice.delete({
            where: { symbol },
        });

        return NextResponse.json(deleted, { status: 200 });
    } catch (error) {
        console.error("❌ Prisma DELETE error:", error);
        return NextResponse.json(
            { error: "Failed to delete record" },
            { status: 500 }
        );
    }
}

//await fetch("/api/manual-average-price");

//await fetch("/api/manual-average-price?symbol=BTC");

// await fetch("/api/manual-average-price", {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//         symbol: "BTC",
//         price: "69000.00", // або date
//     }),
// });

// await fetch("/api/manual-average-price?symbol=BTC", {
//     method: "DELETE",
// });

