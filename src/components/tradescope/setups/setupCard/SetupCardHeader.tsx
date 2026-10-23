import {
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import type {
    SetupDirection,
} from "@/types/setup";

import {
    SetupStatusToggle,
} from "./SetupStatusToggle";

type SetupCardHeaderProps = {
    symbol: string;
    direction: SetupDirection;
    isActive: boolean;
    isUpdatingStatus: boolean;
    onToggleStatusAction: () => void;
};

const SetupCardHeader = ({
                             symbol,
                             direction,
                             isActive,
                             isUpdatingStatus,
                             onToggleStatusAction,
                         }: SetupCardHeaderProps) => {
    const isLong =
        direction === "LONG";

    return (
        <header
            className="
                flex
                min-w-0
                items-center
                gap-2
            "
        >
            <div
                className={`
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${
                    isLong
                        ? `
                                bg-[color-mix(in_srgb,var(--color-success)_10%,var(--color-surface))]
                                text-[var(--color-success)]
                            `
                        : `
                                bg-[color-mix(in_srgb,var(--color-danger)_10%,var(--color-surface))]
                                text-[var(--color-danger)]
                            `
                }
                `}
            >
                {isLong ? (
                    <TrendingUp
                        className="size-4"
                        aria-hidden="true"
                    />
                ) : (
                    <TrendingDown
                        className="size-4"
                        aria-hidden="true"
                    />
                )}
            </div>

            <h2
                className="
                    min-w-0
                    flex-1
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                    text-lg
                    font-semibold
                    tracking-tight
                    text-[var(--color-text)]
                "
                title={symbol}
            >
                {symbol}
            </h2>

            <SetupStatusToggle
                isActive={isActive}
                isUpdating={
                    isUpdatingStatus
                }
                onToggleAction={
                    onToggleStatusAction
                }
            />

            <span
                className={`
                    ml-1
                    shrink-0
                    text-xs
                    font-semibold
                    ${
                    isLong
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-danger)]"
                }
                `}
            >
                {direction}
            </span>
        </header>
    );
};

export {SetupCardHeader};