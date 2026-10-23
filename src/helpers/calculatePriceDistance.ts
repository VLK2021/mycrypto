type PriceDistanceResult = {
    percent: number;
    priceDifference: number;
};

type CalculatePriceDistanceParams = {
    currentPrice: number | null;
    levelPrice: string | number;
};

const calculatePriceDistance = ({
                                    currentPrice,
                                    levelPrice,
                                }: CalculatePriceDistanceParams): PriceDistanceResult | null => {
    const numericLevelPrice =
        Number(levelPrice);

    if (
        currentPrice === null ||
        !Number.isFinite(currentPrice) ||
        currentPrice <= 0 ||
        !Number.isFinite(numericLevelPrice) ||
        numericLevelPrice <= 0
    ) {
        return null;
    }

    const priceDifference =
        numericLevelPrice -
        currentPrice;

    const percent =
        (priceDifference /
            currentPrice) *
        100;

    return {
        percent,
        priceDifference,
    };
};

export {calculatePriceDistance};

export type {
    CalculatePriceDistanceParams,
    PriceDistanceResult,
};