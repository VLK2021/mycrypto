import { NextResponse } from "next/server"
import { runScan } from "./rsiScanner"

const CACHE_TTL = 120000

let CACHE = {
    time: 0,
    data: [] as any[]
}

let SCANNING = false

export async function GET() {

    const now = Date.now()

    if (CACHE.data.length === 0) {

        const data = await runScan()

        CACHE = {
            time: now,
            data
        }

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

    if (!SCANNING) {

        SCANNING = true

        runScan().then((data) => {

            CACHE = {
                time: Date.now(),
                data
            }

            SCANNING = false
        })
    }

    return NextResponse.json({
        cached: true,
        data: CACHE.data
    })
}