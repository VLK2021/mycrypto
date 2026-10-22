import { NextResponse } from "next/server"
import { runScan } from "./rsiScanner"

export const runtime = "nodejs"

const CACHE_TTL = 120000

let CACHE: {
    time: number
    data: any[]
} = {
    time: 0,
    data: []
}

let SCANNING: Promise<any[]> | null = null

async function scan() {
    if (!SCANNING) {
        SCANNING = runScan()
            .then((data) => {
                if (!Array.isArray(data)) {
                    throw new Error("Scanner returned invalid data")
                }

                CACHE = {
                    time: Date.now(),
                    data
                }

                return data
            })
            .finally(() => {
                SCANNING = null
            })
    }

    return SCANNING
}

export async function GET() {
    try {
        const now = Date.now()

        if (CACHE.time === 0) {
            const data = await scan()

            return NextResponse.json({
                cached: false,
                data
            })
        }

        if (now - CACHE.time < CACHE_TTL) {
            return NextResponse.json({
                cached: true,
                data: CACHE.data
            })
        }

        // Повертаємо старі дані, поки сканер оновлює кеш
        void scan().catch((error) => {
            console.error("RSI background scan error:", error)
        })

        return NextResponse.json({
            cached: true,
            data: CACHE.data
        })

    } catch (error) {
        console.error("RSI API ERROR:", error)

        return NextResponse.json(
            {
                error: "RSI scanner failed",
                data: []
            },
            { status: 500 }
        )
    }
}