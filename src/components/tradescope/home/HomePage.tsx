
import { setupQuerySchema } from "@/schemas/setup.schema";
import { getSetups } from "@/services/setup.service";

import type { SetupItem } from "@/types/setup";

import { AddSetupButton } from "@/components/tradescope/AddSetupButton";
import { SetupFilters } from "@/components/tradescope/filters/setupFilters";
import { SetupPagination } from "@/components/tradescope/paginations/setupPagination";
import { SetupsList } from "@/components/tradescope/setups";

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
    searchParams: HomePageSearchParams;
};

const HomePage = async ({
                            searchParams,
                        }: HomePageProps) => {

    // VALIDATE SEARCH PARAMS

    const query = setupQuerySchema.parse(searchParams);

    // LOAD SETUPS

    const result = await getSetups(query);

    const setups = result.data as SetupItem[];

    // PAGINATION DATA

    const {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    } = result.pagination;

    // ACTIVE FILTERS

    const hasActiveFilters =
        query.status !== "all" ||
        query.direction !== "all" ||
        Boolean(query.symbol);

    return (
        <main
            className="
                mx-auto
                w-full
                max-w-[1600px]
                px-4
                py-6
                sm:px-6
                lg:px-8
            "
        >

            {/* PAGE HEADER */}

            <header
                className="
                    mb-8
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                {/* TITLE */}

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                        <h1
                            className="
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-[var(--color-text)]
                                sm:text-3xl
                            "
                        >
                            TradeScope
                        </h1>

                        {/* SETUPS COUNTER */}

                        <span
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
                        </span>

                    </div>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-[var(--color-text-secondary)]
                        "
                    >
                        Торгові сетапи та рівні управління позиціями
                    </p>

                </div>

                {/* ADD SETUP BUTTON */}

                <div className="flex shrink-0 items-center">
                    <AddSetupButton />
                </div>

            </header>

            {/* MAIN CONTENT */}

            <section
                aria-label="Торгові сетапи"
                className="flex flex-col gap-6"
            >

                {/* FILTERS */}

                <SetupFilters
                    symbol={query.symbol}
                    status={query.status}
                    direction={query.direction}
                    sort={query.sort}
                    order={query.order}
                />

                {/* SETUPS LIST */}

                <SetupsList
                    setups={setups}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* PAGINATION */}

                {totalPages > 1 && (
                    <SetupPagination
                        page={page}
                        limit={limit}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                    />
                )}

            </section>

        </main>
    );
};

export { HomePage };

export type { HomePageSearchParams };
