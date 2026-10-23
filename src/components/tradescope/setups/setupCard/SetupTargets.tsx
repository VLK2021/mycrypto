import {
    formatSetupPrice,
} from "@/helpers/formatSetupPrice";

type SetupTargetsProps = {
    stopLoss: string | null;
    takeProfits: string[];
};

const SetupTargets = ({
                          stopLoss,
                          takeProfits,
                      }: SetupTargetsProps) => {
    const formattedTakeProfits =
        takeProfits.length > 0
            ? takeProfits
                .map(
                    formatSetupPrice,
                )
                .join(" / ")
            : "—";

    return (
        <section
            className="
                grid
                min-h-[58px]
                grid-cols-[72px_minmax(0,1fr)]
                gap-3
                border-t
                border-[var(--color-border)]
                pt-2.5
            "
        >
            <div className="min-w-0">
                <h3
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        text-[var(--color-danger)]
                    "
                >
                    SL
                </h3>

                <p
                    className="
                        mt-1
                        min-w-0
                        overflow-hidden
                        text-ellipsis
                        whitespace-nowrap
                        font-mono
                        text-xs
                        font-semibold
                        tabular-nums
                        text-[var(--color-danger)]
                    "
                    title={
                        stopLoss ??
                        undefined
                    }
                >
                    {stopLoss
                        ? formatSetupPrice(
                            stopLoss,
                        )
                        : "—"}
                </p>
            </div>

            <div className="min-w-0">
                <h3
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        text-[var(--color-text-secondary)]
                    "
                >
                    TP
                </h3>

                <p
                    className="
                        mt-1
                        min-w-0
                        overflow-hidden
                        text-ellipsis
                        whitespace-nowrap
                        font-mono
                        text-xs
                        font-semibold
                        tabular-nums
                        text-[var(--color-success)]
                    "
                    title={
                        formattedTakeProfits
                    }
                >
                    {
                        formattedTakeProfits
                    }
                </p>
            </div>
        </section>
    );
};

export {
    SetupTargets,
};