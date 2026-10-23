"use client";

import {
    type ChangeEvent,
    type FormEvent,
    useState,
    useTransition,
} from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    RotateCcw,
    Search,
} from "lucide-react";

type SetupFiltersProps = {
    symbol: string;

    status:
        | "all"
        | "active"
        | "inactive";

    direction:
        | "all"
        | "LONG"
        | "SHORT";

    sort:
        | "createdAt"
        | "updatedAt"
        | "symbol";

    order:
        | "asc"
        | "desc";
};

type SetupFiltersContentProps =
    SetupFiltersProps;

const SetupFiltersContent = ({
                                 symbol,
                                 status,
                                 direction,
                                 sort,
                                 order,
                             }: SetupFiltersContentProps) => {
    const router =
        useRouter();

    const pathname =
        usePathname();

    const searchParams =
        useSearchParams();

    const [
        searchValue,
        setSearchValue,
    ] = useState(symbol);

    const [
        isPending,
        startTransition,
    ] = useTransition();

    const updateSearchParams = (
        updates: Record<
            string,
            string | null
        >,
    ): void => {
        const params =
            new URLSearchParams(
                searchParams.toString(),
            );

        Object.entries(
            updates,
        ).forEach(
            ([
                 key,
                 value,
             ]) => {
                if (
                    value === null ||
                    value === ""
                ) {
                    params.delete(
                        key,
                    );

                    return;
                }

                params.set(
                    key,
                    value,
                );
            },
        );

        params.delete(
            "page",
        );

        startTransition(() => {
            const queryString =
                params.toString();

            router.push(
                queryString
                    ? `${pathname}?${queryString}`
                    : pathname,
                {
                    scroll: false,
                },
            );
        });
    };

    const handleSearchSubmit = (
        event: FormEvent<HTMLFormElement>,
    ): void => {
        event.preventDefault();

        updateSearchParams({
            symbol:
                searchValue
                    .trim()
                    .toUpperCase() ||
                null,
        });
    };

    const handleStatusChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const value =
            event.target.value;

        updateSearchParams({
            status:
                value === "all"
                    ? null
                    : value,
        });
    };

    const handleDirectionChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const value =
            event.target.value;

        updateSearchParams({
            direction:
                value === "all"
                    ? null
                    : value,
        });
    };

    const handleSortChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const value =
            event.target.value;

        updateSearchParams({
            sort:
                value === "createdAt"
                    ? null
                    : value,
        });
    };

    const handleOrderChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const value =
            event.target.value;

        updateSearchParams({
            order:
                value === "desc"
                    ? null
                    : value,
        });
    };

    const handleReset = (): void => {
        setSearchValue("");

        startTransition(() => {
            router.push(
                pathname,
                {
                    scroll: false,
                },
            );
        });
    };

    const hasChangedFilters =
        Boolean(symbol) ||
        status !== "all" ||
        direction !== "all" ||
        sort !== "createdAt" ||
        order !== "desc";

    const selectClassName = `
        h-8
        w-full
        cursor-pointer
        rounded-md
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        px-2.5
        text-[11px]
        font-normal
        text-[var(--color-text-secondary)]
        outline-none
        transition-colors
        hover:text-[var(--color-text)]
        focus:border-[var(--color-brand)]
        focus:text-[var(--color-text)]
        disabled:cursor-wait
        disabled:opacity-50
    `;

    return (
        <section
            aria-label="Фільтрація та сортування сетапів"
            className="
                mb-5
                rounded-xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                p-2.5
                sm:p-3
            "
        >
            <div
                className="
                    grid
                    gap-2
                    md:grid-cols-2
                    xl:grid-cols-[minmax(220px,1.45fr)_minmax(125px,0.75fr)_minmax(135px,0.8fr)_minmax(165px,1fr)_minmax(135px,0.8fr)_auto]
                "
            >
                <form
                    onSubmit={
                        handleSearchSubmit
                    }
                    className="
                        flex
                        h-8
                        min-w-0
                        items-center
                        rounded-md
                        border
                        border-[var(--color-border)]
                        bg-[var(--color-background)]
                        transition-colors
                        focus-within:border-[var(--color-brand)]
                    "
                >
                    <Search
                        className="
                            ml-2.5
                            size-3.5
                            shrink-0
                            text-[var(--color-text-muted)]
                        "
                        aria-hidden="true"
                    />

                    <label
                        htmlFor="setup-symbol-search"
                        className="sr-only"
                    >
                        Пошук за тикером
                    </label>

                    <input
                        id="setup-symbol-search"
                        type="search"
                        value={
                            searchValue
                        }
                        disabled={
                            isPending
                        }
                        onChange={(
                            event,
                        ) => {
                            setSearchValue(
                                event
                                    .target
                                    .value
                                    .toUpperCase(),
                            );
                        }}
                        placeholder="Пошук за тикером"
                        className="
                            h-full
                            min-w-0
                            flex-1
                            bg-transparent
                            px-2
                            text-[11px]
                            font-normal
                            text-[var(--color-text-secondary)]
                            outline-none
                            placeholder:text-[var(--color-text-muted)]
                            focus:text-[var(--color-text)]
                            disabled:cursor-wait
                        "
                    />

                    <button
                        type="submit"
                        disabled={
                            isPending
                        }
                        className="
                            mr-0.5
                            flex
                            h-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-[5px]
                            bg-[var(--color-brand)]
                            px-2.5
                            text-[11px]
                            font-medium
                            text-white
                            transition-colors
                            hover:bg-[var(--color-brand-hover)]
                            disabled:cursor-wait
                            disabled:opacity-60
                        "
                    >
                        Знайти
                    </button>
                </form>

                <div>
                    <label
                        htmlFor="setup-status-filter"
                        className="sr-only"
                    >
                        Статус
                    </label>

                    <select
                        id="setup-status-filter"
                        value={status}
                        disabled={
                            isPending
                        }
                        onChange={
                            handleStatusChange
                        }
                        className={
                            selectClassName
                        }
                    >
                        <option value="all">
                            Усі статуси
                        </option>

                        <option value="active">
                            Активні
                        </option>

                        <option value="inactive">
                            Неактивні
                        </option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="setup-direction-filter"
                        className="sr-only"
                    >
                        Напрямок
                    </label>

                    <select
                        id="setup-direction-filter"
                        value={direction}
                        disabled={
                            isPending
                        }
                        onChange={
                            handleDirectionChange
                        }
                        className={
                            selectClassName
                        }
                    >
                        <option value="all">
                            LONG і SHORT
                        </option>

                        <option value="LONG">
                            LONG
                        </option>

                        <option value="SHORT">
                            SHORT
                        </option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="setup-sort-filter"
                        className="sr-only"
                    >
                        Сортування
                    </label>

                    <select
                        id="setup-sort-filter"
                        value={sort}
                        disabled={
                            isPending
                        }
                        onChange={
                            handleSortChange
                        }
                        className={
                            selectClassName
                        }
                    >
                        <option value="createdAt">
                            За датою створення
                        </option>

                        <option value="updatedAt">
                            За датою оновлення
                        </option>

                        <option value="symbol">
                            За тикером
                        </option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="setup-order-filter"
                        className="sr-only"
                    >
                        Порядок сортування
                    </label>

                    <select
                        id="setup-order-filter"
                        value={order}
                        disabled={
                            isPending
                        }
                        onChange={
                            handleOrderChange
                        }
                        className={
                            selectClassName
                        }
                    >
                        <option value="desc">
                            За спаданням
                        </option>

                        <option value="asc">
                            За зростанням
                        </option>
                    </select>
                </div>

                <button
                    type="button"
                    disabled={
                        !hasChangedFilters ||
                        isPending
                    }
                    onClick={
                        handleReset
                    }
                    className="
                        flex
                        h-8
                        items-center
                        justify-center
                        gap-1.5
                        rounded-md
                        border
                        border-[var(--color-border)]
                        px-2.5
                        text-[11px]
                        font-normal
                        text-[var(--color-text-muted)]
                        transition-colors
                        hover:bg-[var(--color-background)]
                        hover:text-[var(--color-text-secondary)]
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                    "
                >
                    <RotateCcw
                        className="size-3.5"
                        aria-hidden="true"
                    />

                    Скинути
                </button>
            </div>

            {isPending ? (
                <p
                    className="
                        mt-1.5
                        text-[10px]
                        text-[var(--color-text-muted)]
                    "
                >
                    Оновлення результатів...
                </p>
            ) : null}
        </section>
    );
};

const SetupFilters = (
    props: SetupFiltersProps,
) => {
    const componentKey = [
        props.symbol,
        props.status,
        props.direction,
        props.sort,
        props.order,
    ].join(":");

    return (
        <SetupFiltersContent
            key={componentKey}
            {...props}
        />
    );
};

export {
    SetupFilters,
};