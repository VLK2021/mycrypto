export type BinanceFuturesFilter = {
    filterType: string;
    minPrice?: string;
    maxPrice?: string;
    tickSize?: string;
    minQty?: string;
    maxQty?: string;
    stepSize?: string;
};

export type BinanceFuturesSymbolRaw = {
    symbol: string;
    pair: string;
    contractType: string;
    status: string;
    baseAsset: string;
    quoteAsset: string;
    marginAsset: string;
    pricePrecision: number;
    quantityPrecision: number;
    filters: BinanceFuturesFilter[];
};

export type BinanceExchangeInfoResponse = {
    symbols: BinanceFuturesSymbolRaw[];
};

export type BinanceFuturesSymbol = {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    pricePrecision: number;
    minPrice: string;
    maxPrice: string;
    tickSize: string;
};