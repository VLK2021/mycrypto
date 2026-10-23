const MAX_PRICE_DECIMALS = 9;

const formatSetupPrice = (
    value: string | number | null,
): string => {
    if (
        value === null ||
        value === "" ||
        !Number.isFinite(Number(value))
    ) {
        return "—";
    }

    const numericValue = Number(value);

    return numericValue.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits:
            MAX_PRICE_DECIMALS,
            useGrouping: false,
        },
    );
};

export {formatSetupPrice};