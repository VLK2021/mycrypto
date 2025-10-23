"use client";
import { useEffect, useRef, useState } from "react";


interface PriceData {
    symbol: string;
    price: number;
}

const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";


export function useBinancePrices(symbols: string[]) {
    const [prices, setPrices] = useState<Record<string, number>>({});
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!symbols.length) return;

        // Якщо підключення вже є — закриваємо попереднє
        if (socketRef.current) socketRef.current.close();

        // Формуємо payload для мультистріму
        const streams = symbols.map((s) => `${s.toLowerCase()}@miniTicker`).join("/");
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            const data = msg.data;
            if (!data?.s || !data?.c) return;
            setPrices((prev) => ({
                ...prev,
                [data.s]: parseFloat(data.c),
            }));
        };

        ws.onerror = () => {}; // просто ігнор
        ws.onclose = () => console.log("🔌 Binance socket closed");

        return () => {
            ws.close();
        };
    }, [symbols.join(",")]); // оновлюємо з'єднання, якщо змінився список монет

    return prices;
}
