import {
    calculatePriceDistance,
} from "@/helpers/calculatePriceDistance";
import {
    formatSetupPrice,
} from "@/helpers/formatSetupPrice";

type SetupEntryRowProps = {
    index: number;
    price: string;
    currentPrice: number | null;
    currency: string;
};

const PERCENT_FRACTION_DIGITS =
    3;

const formatSignedPercent = (
    value: number,
): string => {
    const sign =
        value > 0 ? "+" : "";

    return `${sign}${value.toFixed(
        PERCENT_FRACTION_DIGITS,
    )}%`;
};

const SetupEntryRow = ({
                           index,
                           price,
                           currentPrice,
                           currency,
                       }: SetupEntryRowProps) => {
    const distance =
        calculatePriceDistance({
            currentPrice,
            levelPrice: price,
        });

    const formattedPercent =
        distance === null
            ? "—"
            : formatSignedPercent(
                distance.percent,
            );

    const formattedDifference =
        distance === null
            ? "—"
            : `(${formatSetupPrice(
                Math.abs(
                    distance.priceDifference,
                ),
            )} ${currency})`;

    const percentClassName =
        distance === null
            ? "text-[var(--color-text-muted)]"
            : distance.percent > 0
                ? "text-[var(--color-success)]"
                : distance.percent < 0
                    ? "text-[var(--color-danger)]"
                    : "text-[var(--color-text-muted)]";

    return (
        <div
            className="
                grid
                min-w-0
                grid-cols-[20px_minmax(0,1fr)_8.5ch_minmax(68px,11ch)]
                items-center
                gap-x-1.5
                py-1
            "
        >
            <span
                className="
                    flex
                    size-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--color-surface)]
                    text-[10px]
                    font-medium
                    text-[var(--color-text-secondary)]
                "
            >
                {index}.
            </span>

            <span
                className="
                    min-w-0
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                    font-mono
                    text-[14px]
                    font-medium
                    tabular-nums
                    text-[var(--color-text)]
                "
                title={price}
            >
                {
                    formatSetupPrice(
                        price,
                    )
                }
            </span>

            <span
                className={`
                    block
                    w-[8.5ch]
                    justify-self-end
                    whitespace-nowrap
                    text-right
                    font-mono
                    text-[13px]
                    font-semibold
                    tabular-nums
                    ${percentClassName}
                `}
            >
                {formattedPercent}
            </span>

            <span
                className="
                    block
                    min-w-0
                    justify-self-end
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                    text-right
                    font-mono
                    text-[10px]
                    tabular-nums
                    text-[var(--color-text-muted)]
                "
                title={
                    formattedDifference
                }
            >
                {
                    formattedDifference
                }
            </span>
        </div>
    );
};

export {
    SetupEntryRow,
};