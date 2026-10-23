import {
    setupQuerySchema,
} from "@/schemas/setup.schema";
import {
    getSetups,
} from "@/services/setup.service";

import type {
    SetupItem,
} from "@//types/setup";
import {SetupPagination} from "@/components/tradescope/paginations/setupPagination";
import {SetupFilters} from "@/components/tradescope/filters/setupFilters";
import {SetupsList} from "@/components/tradescope/setups";


type HomePageSearchParams = {
    page?: string;
    limit?: string;
    status?: string;
    direction?: string;
    symbol?: string;
    sort?: string;
    order?: string;
};

type HomePageProps = {
    searchParams:
        HomePageSearchParams;
};

const HomePage = async ({
                            searchParams,
                        }: HomePageProps) => {
    const query =
        setupQuerySchema.parse(
            searchParams,
        );

    const result =
        await getSetups(
            query,
        );

    const setups =
        result.data as SetupItem[];

    const {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    } = result.pagination;

    const hasActiveFilters =
        query.status !== "all" ||
        query.direction !== "all" ||
        Boolean(
            query.symbol,
        );

    return (
        <main
            className="
                mx-auto
                w-full
                max-w-[1600px]
                px-4
                py-8
                sm:px-5
                md:px-6
                lg:px-8
            "
        >
            <div className="mb-6">
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    "
                >
                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-[var(--color-text)]
                        "
                    >
                        TradeScope
                    </h1>

                    <div
                        title={
                            hasActiveFilters
                                ? "Кількість знайдених сетапів"
                                : "Загальна кількість сетапів"
                        }
                        className="
                            inline-flex
                            h-7
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[var(--color-border)]
                            bg-[var(--color-surface)]
                            px-3
                            text-sm
                            font-medium
                            tabular-nums
                            text-[var(--color-text-secondary)]
                        "
                    >
                        <span
                            className="
                                size-1.5
                                rounded-full
                                bg-[var(--color-brand)]
                            "
                            aria-hidden="true"
                        />

                        {totalItems}
                    </div>
                </div>

                <p
                    className="
                        mt-1
                        text-sm
                        text-[var(--color-text-secondary)]
                    "
                >
                    Торгові сетапи та рівні
                    управління позиціями
                </p>
            </div>

            <SetupFilters
                symbol={
                    query.symbol
                }
                status={
                    query.status
                }
                direction={
                    query.direction
                }
                sort={
                    query.sort
                }
                order={
                    query.order
                }
            />

            <SetupsList
                setups={
                    setups
                }
                hasActiveFilters={
                    hasActiveFilters
                }
            />

            <SetupPagination
                page={page}
                limit={limit}
                totalItems={
                    totalItems
                }
                totalPages={
                    totalPages
                }
                hasNextPage={
                    hasNextPage
                }
                hasPreviousPage={
                    hasPreviousPage
                }
            />
        </main>
    );
};

export {
    HomePage,
};

export type {
    HomePageSearchParams,
};