import { ApiError } from "@/helpers";
import { getBinanceFuturesSymbol } from "@/services";
import type { BinanceFuturesSymbol } from "@/types";

type SetupMarketData = {
    symbol: string;
    entries: string[];
    takeProfits: string[];
    stopLoss?: string | null;
};

type SetupMarketValidationError = {
    field: string;
    message: string;
};

const DECIMAL_VALUE_PATTERN = /^\d+(?:\.\d+)?$/;

const getDecimalPlaces = (
    value: string,
): number => {
    const decimalPart = value.split(".")[1];

    return decimalPart?.length ?? 0;
};

const convertDecimalToBigInt = (
    value: string,
    decimalPlaces: number,
): bigint => {
    const [integerPart, decimalPart = ""] =
        value.split(".");

    const normalizedDecimalPart =
        decimalPart.padEnd(
            decimalPlaces,
            "0",
        );

    return BigInt(
        `${integerPart}${normalizedDecimalPart}`,
    );
};

const isValidBinancePrice = (
    price: string,
    symbol: BinanceFuturesSymbol,
): boolean => {
    const normalizedPrice = price.trim();

    if (
        !DECIMAL_VALUE_PATTERN.test(
            normalizedPrice,
        )
    ) {
        return false;
    }

    const decimalPlaces = Math.max(
        getDecimalPlaces(normalizedPrice),
        getDecimalPlaces(symbol.minPrice),
        getDecimalPlaces(symbol.maxPrice),
        getDecimalPlaces(symbol.tickSize),
    );

    const priceValue =
        convertDecimalToBigInt(
            normalizedPrice,
            decimalPlaces,
        );

    const minPriceValue =
        convertDecimalToBigInt(
            symbol.minPrice,
            decimalPlaces,
        );

    const maxPriceValue =
        convertDecimalToBigInt(
            symbol.maxPrice,
            decimalPlaces,
        );

    const tickSizeValue =
        convertDecimalToBigInt(
            symbol.tickSize,
            decimalPlaces,
        );

    const zero = BigInt(0);

    if (
        priceValue <= zero ||
        tickSizeValue <= zero
    ) {
        return false;
    }

    if (
        minPriceValue > zero &&
        priceValue < minPriceValue
    ) {
        return false;
    }

    if (
        maxPriceValue > zero &&
        priceValue > maxPriceValue
    ) {
        return false;
    }

    return (
        (priceValue - minPriceValue) %
        tickSizeValue ===
        zero
    );
};

const createPriceValidationMessage = (
    symbol: BinanceFuturesSymbol,
): string => {
    return (
        `Ціна має відповідати кроку ` +
        `${symbol.tickSize} для ${symbol.symbol}`
    );
};

const validatePriceList = (
    prices: string[],
    field: "entries" | "takeProfits",
    symbol: BinanceFuturesSymbol,
): SetupMarketValidationError[] => {
    return prices.reduce<
        SetupMarketValidationError[]
    >((errors, price, index) => {
        if (
            !isValidBinancePrice(
                price,
                symbol,
            )
        ) {
            errors.push({
                field: `${field}.${index}`,
                message:
                    createPriceValidationMessage(
                        symbol,
                    ),
            });
        }

        return errors;
    }, []);
};

export const validateSetupMarketData = async (
    data: SetupMarketData,
): Promise<string> => {
    const normalizedSymbol = data.symbol
        .trim()
        .toUpperCase();

    const binanceSymbol =
        await getBinanceFuturesSymbol(
            normalizedSymbol,
        );

    if (!binanceSymbol) {
        throw new ApiError(
            "Передані дані не пройшли валідацію",
            400,
            [
                {
                    field: "symbol",
                    message:
                        "Такий USDT Futures інструмент не торгується на Binance",
                },
            ],
        );
    }

    const validationErrors: SetupMarketValidationError[] =
        [
            ...validatePriceList(
                data.entries,
                "entries",
                binanceSymbol,
            ),

            ...validatePriceList(
                data.takeProfits,
                "takeProfits",
                binanceSymbol,
            ),
        ];

    if (
        data.stopLoss &&
        !isValidBinancePrice(
            data.stopLoss,
            binanceSymbol,
        )
    ) {
        validationErrors.push({
            field: "stopLoss",
            message:
                createPriceValidationMessage(
                    binanceSymbol,
                ),
        });
    }

    if (validationErrors.length > 0) {
        throw new ApiError(
            "Передані ціни не відповідають правилам Binance",
            400,
            validationErrors,
        );
    }

    return normalizedSymbol;
};