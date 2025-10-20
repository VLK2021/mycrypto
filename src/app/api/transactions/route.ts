import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        const search = url.searchParams.get("search")?.toUpperCase() || "";
        const type = url.searchParams.get("type") || "";
        const sortBy = url.searchParams.get("sortBy") || "date";
        const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "8");
        const dateFrom = url.searchParams.get("dateFrom");
        const dateTo = url.searchParams.get("dateTo");

        const skip = (page - 1) * limit;

        // 🔹 Фільтри
        const where: any = {};
        if (search) where.symbol = { contains: search, mode: "insensitive" };
        if (type) where.type = type;
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) where.date.gte = new Date(dateFrom);
            if (dateTo) where.date.lte = new Date(dateTo);
        }

        // 🔹 Сортування
        let orderBy: any = {};
        if (["date", "price", "amount", "total"].includes(sortBy))
            orderBy[sortBy] = order;
        else orderBy = { date: "desc" };

        // 🔹 Основні дані + підрахунки
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({ where, orderBy, skip, take: limit }),
            prisma.transaction.count({ where }),
        ]);

        // 🔹 Статистика (окремо BUY / SELL)
        const [buyAgg, sellAgg] = await Promise.all([
            prisma.transaction.aggregate({
                _sum: { total: true },
                _count: { id: true },
                where: { ...where, type: "BUY" },
            }),
            prisma.transaction.aggregate({
                _sum: { total: true },
                _count: { id: true },
                where: { ...where, type: "SELL" },
            }),
        ]);

        const totalBuy = buyAgg._sum.total || 0;
        const totalSell = sellAgg._sum.total || 0;
        const buyCount = buyAgg._count.id || 0;
        const sellCount = sellAgg._count.id || 0;

        const count = buyCount + sellCount;
        const net = totalBuy - totalSell;
        const avgSize = count > 0 ? (totalBuy + totalSell) / count : 0;
        const avgBuy = buyCount > 0 ? totalBuy / buyCount : 0;
        const avgSell = sellCount > 0 ? totalSell / sellCount : 0;

        const stats = { totalBuy, totalSell, count, net, avgSize, avgBuy, avgSell };
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            data: transactions,
            meta: { total, totalPages, page, limit, sortBy, order, dateFrom, dateTo, stats },
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}
