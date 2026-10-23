"use client";


import {
    SetupEntryRow,
} from "./SetupEntryRow";
import uk from "@/locales/uk";
import en from "@/locales/en";
import {useLanguage} from "@/context";

type SetupEntriesProps = {
    entries: string[];
    currentPrice: number | null;
};

const SetupEntries = ({
                          entries,
                          currentPrice,
                      }: SetupEntriesProps) => {
    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    return (
        <section
            className="
                min-w-0
                border-t
                border-[var(--color-border)]
                pt-2.5
            "
        >
            <div
                className="
                    mb-1
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <h3
                    className="
                        text-xs
                        font-medium
                        text-[var(--color-text-secondary)]
                    "
                >
                    {
                        t.entries
                    }
                </h3>

                {entries.length > 2 ? (
                    <span
                        className="
                            text-[10px]
                            text-[var(--color-text-muted)]
                        "
                    >
                        {entries.length}
                    </span>
                ) : null}
            </div>

            <div
                className="
                    h-[62px]
                    min-h-[62px]
                    overflow-y-auto
                    overscroll-contain
                    pr-1.5
                    [scrollbar-color:var(--color-border)_transparent]
                    [scrollbar-width:thin]
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[var(--color-border)]
                    hover:[&::-webkit-scrollbar-thumb]:bg-[var(--color-text-muted)]
                "
            >
                {entries.map(
                    (
                        entry,
                        index,
                    ) => (
                        <SetupEntryRow
                            key={`${entry}-${index}`}
                            index={
                                index + 1
                            }
                            price={
                                entry
                            }
                            currentPrice={
                                currentPrice
                            }
                            currency={
                                t.currency
                            }
                        />
                    ),
                )}
            </div>
        </section>
    );
};

export {
    SetupEntries,
};