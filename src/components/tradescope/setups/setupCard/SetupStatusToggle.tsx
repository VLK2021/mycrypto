"use client";

import {
    LoaderCircle,
} from "lucide-react";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";



type SetupStatusToggleProps = {
    isActive: boolean;
    isUpdating: boolean;
    onToggleAction: () => void;
};

const SetupStatusToggle = ({
                               isActive,
                               isUpdating,
                               onToggleAction,
                           }: SetupStatusToggleProps) => {
    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    const label = isActive
        ? t.active
        : t.inactive;

    const actionLabel = isActive
        ? t.makeInactive
        : t.makeActive;

    return (
        <button
            type="button"
            aria-label={actionLabel}
            title={actionLabel}
            disabled={isUpdating}
            onClick={onToggleAction}
            className={`
                inline-flex
                h-6
                shrink-0
                cursor-pointer
                items-center
                justify-center
                gap-1
                rounded-md
                border
                px-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                transition-colors
                disabled:cursor-wait
                disabled:opacity-60
                ${
                isActive
                    ? `
                            border-[color-mix(in_srgb,var(--color-success)_18%,transparent)]
                            bg-[color-mix(in_srgb,var(--color-success)_8%,transparent)]
                            text-[var(--color-success)]
                            hover:bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)]
                        `
                    : `
                            border-[var(--color-border)]
                            bg-transparent
                            text-[var(--color-text-muted)]
                            hover:border-[var(--color-text-muted)]
                            hover:text-[var(--color-text)]
                        `
            }
            `}
        >
            {isUpdating ? (
                <LoaderCircle
                    className="
                        size-3
                        animate-spin
                    "
                    aria-hidden="true"
                />
            ) : (
                <span
                    className={`
                        size-1
                        rounded-full
                        ${
                        isActive
                            ? "bg-[var(--color-success)]"
                            : "bg-[var(--color-text-muted)]"
                    }
                    `}
                    aria-hidden="true"
                />
            )}

            {label}
        </button>
    );
};

export {SetupStatusToggle};