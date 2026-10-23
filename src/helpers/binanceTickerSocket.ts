type PriceListener = (
    price: number,
) => void;

type BinanceMarkPriceEvent = {
    e?: string;
    E?: number;
    s?: string;
    p?: string;
};

type BinanceCombinedMessage = {
    stream?: string;
    data?: BinanceMarkPriceEvent;
};

type BinanceSubscriptionResponse = {
    result?: null;
    id?: number;
};

type BinanceErrorResponse = {
    code?: number;
    msg?: string;
    id?: number;
};

const BINANCE_FUTURES_SOCKET_URL =
    "wss://fstream.binance.com/market/stream";

const RECONNECT_DELAY_MS = 3000;

const normalizeSymbol = (
    symbol: string,
): string => {
    return symbol
        .trim()
        .toUpperCase();
};

const getStreamName = (
    symbol: string,
): string => {
    return `${normalizeSymbol(
        symbol,
    ).toLowerCase()}@markPrice@1s`;
};

class BinanceTickerSocket {
    private socket: WebSocket | null =
        null;

    private listeners =
        new Map<
            string,
            Set<PriceListener>
        >();

    private prices =
        new Map<string, number>();

    private reconnectTimer:
        | ReturnType<
        typeof setTimeout
    >
        | null = null;

    private requestId = 1;

    private intentionallyClosed =
        false;

    subscribe(
        symbol: string,
        listener: PriceListener,
    ): () => void {
        const normalizedSymbol =
            normalizeSymbol(symbol);

        if (!normalizedSymbol) {
            return () => undefined;
        }

        const symbolListeners =
            this.listeners.get(
                normalizedSymbol,
            ) ??
            new Set<PriceListener>();

        const isFirstListener =
            symbolListeners.size === 0;

        symbolListeners.add(
            listener,
        );

        this.listeners.set(
            normalizedSymbol,
            symbolListeners,
        );

        const cachedPrice =
            this.prices.get(
                normalizedSymbol,
            );

        if (
            cachedPrice !==
            undefined
        ) {
            listener(cachedPrice);
        }

        this.intentionallyClosed =
            false;

        this.connect();

        if (
            isFirstListener &&
            this.socket?.readyState ===
            WebSocket.OPEN
        ) {
            this.sendSubscription(
                "SUBSCRIBE",
                normalizedSymbol,
            );
        }

        return () => {
            this.unsubscribe(
                normalizedSymbol,
                listener,
            );
        };
    }

    private unsubscribe(
        symbol: string,
        listener: PriceListener,
    ): void {
        const symbolListeners =
            this.listeners.get(
                symbol,
            );

        if (!symbolListeners) {
            return;
        }

        symbolListeners.delete(
            listener,
        );

        if (
            symbolListeners.size >
            0
        ) {
            return;
        }

        this.listeners.delete(
            symbol,
        );

        this.prices.delete(
            symbol,
        );

        if (
            this.socket?.readyState ===
            WebSocket.OPEN
        ) {
            this.sendSubscription(
                "UNSUBSCRIBE",
                symbol,
            );
        }

        if (
            this.listeners.size ===
            0
        ) {
            this.disconnect();
        }
    }

    private connect(): void {
        if (
            typeof window ===
            "undefined"
        ) {
            return;
        }

        if (
            this.socket?.readyState ===
            WebSocket.OPEN ||
            this.socket?.readyState ===
            WebSocket.CONNECTING
        ) {
            return;
        }

        this.clearReconnectTimer();

        this.socket =
            new WebSocket(
                BINANCE_FUTURES_SOCKET_URL,
            );

        this.socket.addEventListener(
            "open",
            this.handleOpen,
        );

        this.socket.addEventListener(
            "message",
            this.handleMessage,
        );

        this.socket.addEventListener(
            "close",
            this.handleClose,
        );

        this.socket.addEventListener(
            "error",
            this.handleError,
        );
    }

    private disconnect(): void {
        this.intentionallyClosed =
            true;

        this.clearReconnectTimer();

        if (!this.socket) {
            return;
        }

        this.removeSocketListeners();

        this.socket.close();

        this.socket = null;
    }

    private handleOpen =
        (): void => {
            const symbols =
                Array.from(
                    this.listeners.keys(),
                );

            if (
                symbols.length === 0
            ) {
                return;
            }

            const streams =
                symbols.map(
                    getStreamName,
                );

            this.sendMessage(
                "SUBSCRIBE",
                streams,
            );
        };

    private handleMessage = (
        event: MessageEvent<string>,
    ): void => {
        try {
            const message: unknown =
                JSON.parse(
                    event.data,
                );

            if (
                this.isSubscriptionResponse(
                    message,
                )
            ) {
                return;
            }

            if (
                this.isErrorResponse(
                    message,
                )
            ) {
                console.error(
                    "Binance Futures WebSocket error:",
                    message.code,
                    message.msg,
                );

                return;
            }

            const priceEvent =
                this.getPriceEvent(
                    message,
                );

            if (
                typeof priceEvent?.s !==
                "string" ||
                typeof priceEvent.p !==
                "string"
            ) {
                return;
            }

            const symbol =
                normalizeSymbol(
                    priceEvent.s,
                );

            const price =
                Number(
                    priceEvent.p,
                );

            if (
                !Number.isFinite(
                    price,
                ) ||
                price <= 0
            ) {
                return;
            }

            this.prices.set(
                symbol,
                price,
            );

            const symbolListeners =
                this.listeners.get(
                    symbol,
                );

            symbolListeners?.forEach(
                (listener) => {
                    listener(price);
                },
            );
        } catch (error) {
            console.error(
                "Failed to process Binance Futures WebSocket message:",
                error,
            );
        }
    };

    private handleClose =
        (): void => {
            this.removeSocketListeners();

            this.socket = null;

            if (
                this.intentionallyClosed ||
                this.listeners.size ===
                0
            ) {
                return;
            }

            this.scheduleReconnect();
        };

    private handleError =
        (): void => {
            this.socket?.close();
        };

    private getPriceEvent(
        message: unknown,
    ): BinanceMarkPriceEvent | null {
        if (
            typeof message !==
            "object" ||
            message === null
        ) {
            return null;
        }

        const directEvent =
            message as BinanceMarkPriceEvent;

        if (
            typeof directEvent.s ===
            "string" &&
            typeof directEvent.p ===
            "string"
        ) {
            return directEvent;
        }

        const combinedMessage =
            message as BinanceCombinedMessage;

        if (
            typeof combinedMessage
                .data?.s ===
            "string" &&
            typeof combinedMessage
                .data?.p ===
            "string"
        ) {
            return combinedMessage.data;
        }

        return null;
    }

    private isSubscriptionResponse(
        message: unknown,
    ): message is BinanceSubscriptionResponse {
        if (
            typeof message !==
            "object" ||
            message === null
        ) {
            return false;
        }

        return (
            "result" in message &&
            "id" in message
        );
    }

    private isErrorResponse(
        message: unknown,
    ): message is BinanceErrorResponse {
        if (
            typeof message !==
            "object" ||
            message === null
        ) {
            return false;
        }

        return (
            "code" in message &&
            "msg" in message
        );
    }

    private sendSubscription(
        method:
            | "SUBSCRIBE"
            | "UNSUBSCRIBE",
        symbol: string,
    ): void {
        this.sendMessage(
            method,
            [
                getStreamName(
                    symbol,
                ),
            ],
        );
    }

    private sendMessage(
        method:
            | "SUBSCRIBE"
            | "UNSUBSCRIBE",
        streams: string[],
    ): void {
        if (
            this.socket?.readyState !==
            WebSocket.OPEN
        ) {
            return;
        }

        this.socket.send(
            JSON.stringify({
                method,
                params: streams,
                id: this.requestId,
            }),
        );

        this.requestId += 1;
    }

    private scheduleReconnect(): void {
        this.clearReconnectTimer();

        this.reconnectTimer =
            setTimeout(() => {
                this.connect();
            }, RECONNECT_DELAY_MS);
    }

    private clearReconnectTimer(): void {
        if (
            !this.reconnectTimer
        ) {
            return;
        }

        clearTimeout(
            this.reconnectTimer,
        );

        this.reconnectTimer =
            null;
    }

    private removeSocketListeners(): void {
        if (!this.socket) {
            return;
        }

        this.socket.removeEventListener(
            "open",
            this.handleOpen,
        );

        this.socket.removeEventListener(
            "message",
            this.handleMessage,
        );

        this.socket.removeEventListener(
            "close",
            this.handleClose,
        );

        this.socket.removeEventListener(
            "error",
            this.handleError,
        );
    }
}

const binanceTickerSocket =
    new BinanceTickerSocket();

export {
    binanceTickerSocket,
    normalizeSymbol,
};