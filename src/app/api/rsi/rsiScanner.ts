import { calculateRSI } from "./rsiCalculator"

const BINANCE = "https://fapi.binance.com"

export type RsiItem = {
    symbol: string
    price: number

    rsi_1h: number
    rsi_4h: number

    candles_overbought_1h: number
    candles_oversold_1h: number

    candles_overbought_4h: number
    candles_oversold_4h: number
}

export async function getSymbols(): Promise<string[]> {

    const res = await fetch(`${BINANCE}/fapi/v1/exchangeInfo`, {
        cache: "no-store"
    })

    const data = await res.json()

    return data.symbols
        .filter((s: any) =>
            s.contractType === "PERPETUAL" &&
            s.status === "TRADING" &&
            s.quoteAsset === "USDT" &&
            s.symbol.endsWith("USDT")
        )
        .map((s: any) => s.symbol)
}

async function fetchKlines(symbol: string, interval: string) {

    const res = await fetch(
        `${BINANCE}/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=100`,
        { cache: "no-store" }
    )

    const data = await res.json()

    return data.map((k: any) => Number(k[4]))
}

function calculateRsiSeries(closes: number[], period = 14) {

    const rsiValues: number[] = []

    for (let i = period; i < closes.length; i++) {

        const slice = closes.slice(i - period, i + 1)

        rsiValues.push(calculateRSI(slice))
    }

    return rsiValues
}

function countZoneCandles(
    rsiValues: number[],
    level: number,
    type: "overbought" | "oversold"
) {

    let count = 0

    for (let i = rsiValues.length - 1; i >= 0; i--) {

        const rsi = rsiValues[i]

        if (type === "overbought") {

            if (rsi >= level) count++
            else break
        }

        if (type === "oversold") {

            if (rsi <= level) count++
            else break
        }
    }

    return count
}

async function scanSymbol(symbol: string): Promise<RsiItem | null> {

    try {

        const [closes1h, closes4h] = await Promise.all([
            fetchKlines(symbol, "1h"),
            fetchKlines(symbol, "4h")
        ])

        const rsiSeries1h = calculateRsiSeries(closes1h)
        const rsiSeries4h = calculateRsiSeries(closes4h)

        const rsi1h = rsiSeries1h[rsiSeries1h.length - 1]
        const rsi4h = rsiSeries4h[rsiSeries4h.length - 1]

        const price = closes1h[closes1h.length - 1]

        return {

            symbol,
            price,

            rsi_1h: rsi1h,
            rsi_4h: rsi4h,

            candles_overbought_1h: countZoneCandles(rsiSeries1h, 70, "overbought"),
            candles_oversold_1h: countZoneCandles(rsiSeries1h, 30, "oversold"),

            candles_overbought_4h: countZoneCandles(rsiSeries4h, 70, "overbought"),
            candles_oversold_4h: countZoneCandles(rsiSeries4h, 30, "oversold")
        }

    } catch {

        return null
    }
}

export async function runScan(): Promise<RsiItem[]> {

    const symbols = await getSymbols()

    const batchSize = 50

    const results: RsiItem[] = []

    for (let i = 0; i < symbols.length; i += batchSize) {

        const batch = symbols.slice(i, i + batchSize)

        const data = await Promise.all(batch.map(scanSymbol))

        results.push(...data.filter(Boolean) as RsiItem[])
    }

    return results
}