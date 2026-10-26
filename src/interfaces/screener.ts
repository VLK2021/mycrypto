export interface ScreenerCoin {
    symbol: string;
    price: number | null;
    change24h: number | null;
    volume: number | null;
    openInterest: number | null;
    funding: number | null;
    rsi1h: number | null;
    rsi4h: number | null;
}

export interface ScreenerCandle {
    time: number;
    close: number;
}

export interface ScreenerSeed {
    symbol: string;
    openInterest: number | null;
    candles1h: ScreenerCandle[] | null;
    candles4h: ScreenerCandle[] | null;
}