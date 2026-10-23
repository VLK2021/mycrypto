"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    binanceTickerSocket,
} from "@/helpers/binanceTickerSocket";

type UseTickerPriceResult = {
    price: number | null;
    isLoading: boolean;
};

const useTickerPrice = (
    symbol: string,
): UseTickerPriceResult => {
    const [price, setPrice] =
        useState<number | null>(null);

    useEffect(() => {
        setPrice(null);

        const unsubscribe =
            binanceTickerSocket.subscribe(
                symbol,
                setPrice,
            );

        return unsubscribe;
    }, [symbol]);

    return {
        price,
        isLoading: price === null,
    };
};

export {useTickerPrice};