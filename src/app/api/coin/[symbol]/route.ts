import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
    _req: Request,
    { params }: { params: { symbol: string } }
) {
    const symbol = params.symbol

    try {
        await prisma.$transaction([
            prisma.transaction.deleteMany({
                where: { symbol }
            }),

            prisma.manualAveragePrice.deleteMany({
                where: { symbol }
            })
        ])

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Failed to delete coin" },
            { status: 500 }
        )
    }
}
