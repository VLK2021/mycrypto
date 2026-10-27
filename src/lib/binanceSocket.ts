// "use client";
// import { useEffect, useRef, useState } from "react";
//
//
// interface PriceData {
//     symbol: string;
//     price: number;
// }
//
// const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";
//
//
// export function useBinancePrices(symbols: string[]) {
//     const [prices, setPrices] = useState<Record<string, number>>({});
//     const socketRef = useRef<WebSocket | null>(null);
//
//     useEffect(() => {
//         if (!symbols.length) return;
//
//         // Якщо підключення вже є — закриваємо попереднє
//         if (socketRef.current) socketRef.current.close();
//
//         // Формуємо payload для мультистріму
//         const streams = symbols.map((s) => `${s.toLowerCase()}@miniTicker`).join("/");
//         const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
//
//         const ws = new WebSocket(wsUrl);
//         socketRef.current = ws;
//
//         ws.onmessage = (event) => {
//             const msg = JSON.parse(event.data);
//             const data = msg.data;
//             if (!data?.s || !data?.c) return;
//             setPrices((prev) => ({
//                 ...prev,
//                 [data.s]: parseFloat(data.c),
//             }));
//         };
//
//         ws.onerror = () => {}; // просто ігнор
//         ws.onclose = () => console.log("🔌 Binance socket closed");
//
//         return () => {
//             ws.close();
//         };
//     }, [symbols.join(",")]); // оновлюємо з'єднання, якщо змінився список монет
//
//     return prices;
// }



"use client";

import { useEffect, useMemo, useState } from "react";

type PriceMap = Record<string, number>;

type Subscriber = {
    symbols: string[];
    onUpdate: (prices: PriceMap) => void;
};

type MiniTicker = {
    s?: string;
    c?: string;
};

type BinanceMessage = {
    data?: MiniTicker;
};

const WS_BASE = "wss://stream.binance.com:9443";

const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_RECONNECT_DELAY = 60_000;
const CONNECTION_DELAY = 100;

const subscribers = new Map<symbol, Subscriber>();

let socket: WebSocket | null = null;
let currentSymbolsKey = "";
let prices: PriceMap = {};

let reconnectAttempts = 0;
let reconnectTimer: number | null = null;
let connectionTimer: number | null = null;

function normalizeSymbols(symbols: string[]): string[] {
    return [...new Set(
        symbols
            .map((symbol) => symbol.trim().toUpperCase())
            .filter(Boolean)
    )].sort();
}

function getRequiredSymbols(): string[] {
    const symbols = new Set<string>();

    for (const subscriber of subscribers.values()) {
        for (const symbol of subscriber.symbols) {
            symbols.add(symbol);
        }
    }

    return [...symbols].sort();
}

function getPricesFor(symbols: string[]): PriceMap {
    const result: PriceMap = {};

    for (const symbol of symbols) {
        const price = prices[symbol];

        if (
            typeof price === "number" &&
            Number.isFinite(price)
        ) {
            result[symbol] = price;
        }
    }

    return result;
}

function notifySubscribers(): void {
    for (const subscriber of subscribers.values()) {
        subscriber.onUpdate(
            getPricesFor(subscriber.symbols)
        );
    }
}

function clearReconnectTimer(): void {
    if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
}

function clearConnectionTimer(): void {
    if (connectionTimer !== null) {
        window.clearTimeout(connectionTimer);
        connectionTimer = null;
    }
}

function closeSocket(): void {
    if (!socket) return;

    const previous = socket;
    socket = null;

    previous.onopen = null;
    previous.onmessage = null;
    previous.onerror = null;
    previous.onclose = null;

    if (
        previous.readyState === WebSocket.OPEN ||
        previous.readyState === WebSocket.CONNECTING
    ) {
        previous.close();
    }
}

function scheduleReconnect(): void {
    if (
        subscribers.size === 0 ||
        reconnectAttempts >= MAX_RECONNECT_ATTEMPTS
    ) {
        return;
    }

    reconnectAttempts++;

    const delay = Math.min(
        MAX_RECONNECT_DELAY,
        1000 * 2 ** reconnectAttempts
    );

    clearReconnectTimer();

    reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null;
        connectSocket();
    }, delay);
}

function connectSocket(): void {
    if (subscribers.size === 0 || socket !== null) {
        return;
    }

    const symbols = getRequiredSymbols();

    if (symbols.length === 0) {
        return;
    }

    currentSymbolsKey = symbols.join(",");

    const streams = symbols
        .map((symbol) =>
            `${symbol.toLowerCase()}@miniTicker`
        )
        .join("/");

    const url = `${WS_BASE}/stream?streams=${streams}`;

    let ws: WebSocket;

    try {
        ws = new WebSocket(url);
    } catch (error) {
        console.error(
            "[BinancePrices] Connection error:",
            error
        );

        scheduleReconnect();
        return;
    }

    socket = ws;

    ws.onopen = () => {
        if (socket !== ws) return;

        reconnectAttempts = 0;

        console.info(
            "[BinancePrices] Connected:",
            symbols.length,
            "symbols"
        );
    };

    ws.onmessage = (event: MessageEvent) => {
        if (socket !== ws) return;

        try {
            const message = JSON.parse(
                String(event.data)
            ) as BinanceMessage;

            const ticker = message.data;

            if (!ticker?.s || !ticker.c) {
                return;
            }

            const price = Number(ticker.c);

            if (!Number.isFinite(price) || price <= 0) {
                return;
            }

            if (prices[ticker.s] === price) {
                return;
            }

            prices = {
                ...prices,
                [ticker.s]: price,
            };

            notifySubscribers();
        } catch (error) {
            console.warn(
                "[BinancePrices] Invalid message:",
                error
            );
        }
    };

    ws.onerror = () => {
        // onclose handles reconnection.
    };

    ws.onclose = (event: CloseEvent) => {
        if (socket !== ws) return;

        socket = null;

        console.warn(
            "[BinancePrices] Disconnected:",
            event.code
        );

        scheduleReconnect();
    };
}

function refreshConnection(): void {
    clearConnectionTimer();
    clearReconnectTimer();

    if (subscribers.size === 0) {
        closeSocket();
        currentSymbolsKey = "";
        reconnectAttempts = 0;
        prices = {};
        return;
    }

    const required = getRequiredSymbols().join(",");

    if (
        required === currentSymbolsKey &&
        socket !== null
    ) {
        return;
    }

    closeSocket();
    reconnectAttempts = 0;

    connectionTimer = window.setTimeout(() => {
        connectionTimer = null;
        connectSocket();
    }, CONNECTION_DELAY);
}

function subscribe(
    symbols: string[],
    onUpdate: (prices: PriceMap) => void
): () => void {
    const id = Symbol("binance-price-subscriber");

    subscribers.set(id, {
        symbols,
        onUpdate,
    });

    onUpdate(getPricesFor(symbols));

    refreshConnection();

    return () => {
        subscribers.delete(id);
        refreshConnection();
    };
}

export function useBinancePrices(
    symbols: string[]
): PriceMap {
    const symbolsKey = useMemo(
        () => normalizeSymbols(symbols).join(","),
        [symbols.join(",")]
    );

    const [result, setResult] = useState<PriceMap>({});

    useEffect(() => {
        const normalized = symbolsKey
            ? symbolsKey.split(",")
            : [];

        if (normalized.length === 0) {
            setResult({});
            return;
        }

        return subscribe(normalized, setResult);
    }, [symbolsKey]);

    return result;
}
