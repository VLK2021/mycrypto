import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        const search  = url.searchParams.get("search")?.toUpperCase() || "";
        const type    = url.searchParams.get("type") || "";
        const sortBy  = url.searchParams.get("sortBy") || "date";
        const order   = url.searchParams.get("order") === "asc" ? "asc" : "desc";
        const page    = parseInt(url.searchParams.get("page")  || "1");
        const limit   = parseInt(url.searchParams.get("limit") || "10");
        const dateFrom = url.searchParams.get("dateFrom");
        const dateTo   = url.searchParams.get("dateTo");

        const skip = (page - 1) * limit;
        const where: any = {};

        // 🔹 пошук по символу
        if (search) where.symbol = { contains: search, mode: "insensitive" };

        // 🔹 фільтр по типу (BUY / SELL)
        if (type) where.type = type;

        // 🔹 фільтр по діапазону дат
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) where.date.gte = new Date(dateFrom);
            if (dateTo)   where.date.lte = new Date(dateTo);
        }

        // 🔹 сортування
        let orderBy: any = {};
        if (["date", "price", "amount", "total"].includes(sortBy))
            orderBy[sortBy] = order;
        else orderBy = { date: "desc" };

        // 🔹 запит
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({ where, orderBy, skip, take: limit }),
            prisma.transaction.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            data: transactions,
            meta: { total, totalPages, page, limit, sortBy, order, dateFrom, dateTo },
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}
