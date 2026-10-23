"use client";

import {
    Pencil,
    Trash2,
} from "lucide-react";


import uk from "@/locales/uk";
import en from "@/locales/en";
import {useLanguage} from "@/context";

type SetupCardActionsProps = {
    onUpdateAction: () => void;
    onDeleteAction: () => void;
};

const SetupCardActions = ({
                              onUpdateAction,
                              onDeleteAction,
                          }: SetupCardActionsProps) => {
    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    return (
        <div
            className="
                flex
                items-center
                justify-end
                gap-2
                border-t
                border-[var(--color-border)]
                px-4
                py-2.5
            "
        >
            <button
                type="button"
                aria-label={
                    t.edit
                }
                title={
                    t.edit
                }
                onClick={
                    onUpdateAction
                }
                className="
                    flex
                    size-9
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-lg
                    text-[var(--color-text-muted)]
                    transition-colors
                    hover:bg-[var(--color-background)]
                    hover:text-[var(--color-text)]
                    active:bg-[var(--color-surface)]
                "
            >
                <Pencil
                    className="size-4"
                    aria-hidden="true"
                />
            </button>

            <button
                type="button"
                aria-label={
                    t.delete
                }
                title={
                    t.delete
                }
                onClick={
                    onDeleteAction
                }
                className="
                    flex
                    size-9
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-lg
                    text-[var(--color-danger)]
                    transition-colors
                    hover:bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)]
                    hover:text-[var(--color-danger)]
                    active:bg-[color-mix(in_srgb,var(--color-danger)_18%,transparent)]
                "
            >
                <Trash2
                    className="size-4"
                    aria-hidden="true"
                />
            </button>
        </div>
    );
};

export {
    SetupCardActions,
};