import {
    Inbox,
    SearchX,
} from "lucide-react";

import type {
    SetupItem,
} from "@/types/setup";

import {
    SetupCard,
} from "./setupCard";

type SetupsListProps = {
    setups: SetupItem[];
    hasActiveFilters: boolean;
};

const SetupsList = ({
                        setups,
                        hasActiveFilters,
                    }: SetupsListProps) => {
    if (
        setups.length === 0
    ) {
        const Icon =
            hasActiveFilters
                ? SearchX
                : Inbox;

        return (
            <div
                className="
                    flex
                    min-h-72
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-[var(--color-border)]
                    px-6
                    py-12
                    text-center
                "
            >
                <Icon
                    className="
                        size-7
                        text-[var(--color-text-muted)]
                    "
                    aria-hidden="true"
                />

                <h2
                    className="
                        mt-4
                        text-lg
                        font-semibold
                        text-[var(--color-text)]
                    "
                >
                    {hasActiveFilters
                        ? "Сетапів не знайдено"
                        : "Сетапів поки немає"}
                </h2>

                {hasActiveFilters ? (
                    <p
                        className="
                            mt-2
                            max-w-md
                            text-sm
                            text-[var(--color-text-secondary)]
                        "
                    >
                        Спробуйте змінити параметри
                        пошуку або скинути активні
                        фільтри.
                    </p>
                ) : null}
            </div>
        );
    }

    return (
        <div
            className="
                grid
                items-start
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
            "
        >
            {setups.map(
                (setup) => (
                    <SetupCard
                        key={
                            setup.id
                        }
                        setup={
                            setup
                        }
                    />
                ),
            )}
        </div>
    );
};

export {
    SetupsList,
};