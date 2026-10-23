"use client";

import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

type SetupPaginationProps = {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

const getPageNumbers = (
    page: number,
    totalPages: number,
): number[] => {
    if (
        totalPages <= 5
    ) {
        return Array.from(
            {
                length:
                totalPages,
            },
            (
                _,
                index,
            ) => index + 1,
        );
    }

    if (
        page <= 3
    ) {
        return [
            1,
            2,
            3,
            4,
            5,
        ];
    }

    if (
        page >=
        totalPages - 2
    ) {
        return [
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        page - 2,
        page - 1,
        page,
        page + 1,
        page + 2,
    ];
};

const SetupPagination = ({
                             page,
                             totalPages,
                             totalItems,
                             limit,
                             hasNextPage,
                             hasPreviousPage,
                         }: SetupPaginationProps) => {
    const router =
        useRouter();

    const pathname =
        usePathname();

    const searchParams =
        useSearchParams();

    if (
        totalPages <= 1 ||
        totalItems === 0
    ) {
        return null;
    }

    const pageNumbers =
        getPageNumbers(
            page,
            totalPages,
        );

    const firstItem =
        (page - 1) *
        limit +
        1;

    const lastItem =
        Math.min(
            page * limit,
            totalItems,
        );

    const changePage = (
        nextPage: number,
    ): void => {
        if (
            nextPage < 1 ||
            nextPage >
            totalPages ||
            nextPage === page
        ) {
            return;
        }

        const params =
            new URLSearchParams(
                searchParams.toString(),
            );

        if (
            nextPage === 1
        ) {
            params.delete(
                "page",
            );
        } else {
            params.set(
                "page",
                String(
                    nextPage,
                ),
            );
        }

        const queryString =
            params.toString();

        router.push(
            queryString
                ? `${pathname}?${queryString}`
                : pathname,
            {
                scroll: true,
            },
        );
    };

    return (
        <nav
            aria-label="Пагінація сетапів"
            className="
                mt-6
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-4
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
            "
        >
            <p
                className="
                    text-sm
                    text-[var(--color-text-secondary)]
                "
            >
                Показано{" "}
                <span
                    className="
                        font-medium
                        text-[var(--color-text)]
                    "
                >
                    {firstItem}–
                    {lastItem}
                </span>{" "}
                із{" "}
                <span
                    className="
                        font-medium
                        text-[var(--color-text)]
                    "
                >
                    {totalItems}
                </span>
            </p>

            <div
                className="
                    flex
                    items-center
                    gap-1.5
                "
            >
                <button
                    type="button"
                    aria-label="Попередня сторінка"
                    disabled={
                        !hasPreviousPage
                    }
                    onClick={() =>
                        changePage(
                            page - 1,
                        )
                    }
                    className="
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[var(--color-border)]
                        text-[var(--color-text-secondary)]
                        transition-colors
                        hover:bg-[var(--color-background)]
                        hover:text-[var(--color-text)]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    <ChevronLeft
                        className="size-4"
                        aria-hidden="true"
                    />
                </button>

                {pageNumbers.map(
                    (
                        pageNumber,
                    ) => {
                        const isCurrentPage =
                            pageNumber ===
                            page;

                        return (
                            <button
                                key={
                                    pageNumber
                                }
                                type="button"
                                aria-label={`Сторінка ${pageNumber}`}
                                aria-current={
                                    isCurrentPage
                                        ? "page"
                                        : undefined
                                }
                                onClick={() =>
                                    changePage(
                                        pageNumber,
                                    )
                                }
                                className={`
                                    flex
                                    size-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    text-sm
                                    font-medium
                                    transition-colors
                                    ${
                                    isCurrentPage
                                        ? `
                                                border-[var(--color-brand)]
                                                bg-[var(--color-brand)]
                                                text-white
                                            `
                                        : `
                                                border-[var(--color-border)]
                                                text-[var(--color-text-secondary)]
                                                hover:bg-[var(--color-background)]
                                                hover:text-[var(--color-text)]
                                            `
                                }
                                `}
                            >
                                {
                                    pageNumber
                                }
                            </button>
                        );
                    },
                )}

                <button
                    type="button"
                    aria-label="Наступна сторінка"
                    disabled={
                        !hasNextPage
                    }
                    onClick={() =>
                        changePage(
                            page + 1,
                        )
                    }
                    className="
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[var(--color-border)]
                        text-[var(--color-text-secondary)]
                        transition-colors
                        hover:bg-[var(--color-background)]
                        hover:text-[var(--color-text)]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    <ChevronRight
                        className="size-4"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </nav>
    );
};

export {
    SetupPagination,
};