"use client";

import {
    useEffect,
    type MouseEvent,
} from "react";
import {
    X,
} from "lucide-react";

// import {
//     useLanguage,
// } from "@/context";
import type {
    SetupItem,
} from "@/types/setup";

import {
    UpdateSetupForm,
} from "./UpdateSetupForm";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

type UpdateSetupModalProps = {
    isOpen: boolean;
    setup: SetupItem;
    onCloseAction: () => void;
};

const UpdateSetupModal = ({
                              isOpen,
                              setup,
                              onCloseAction,
                          }: UpdateSetupModalProps) => {
    // const { locale } =
    //     useLanguage();

    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (
                event.key ===
                "Escape"
            ) {
                onCloseAction();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [
        isOpen,
        onCloseAction,
    ]);

    if (!isOpen) {
        return null;
    }

    const handleDialogClick = (
        event: MouseEvent<HTMLDivElement>,
    ) => {
        event.stopPropagation();
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/60
                p-4
                backdrop-blur-sm
            "
            onClick={
                onCloseAction
            }
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="update-setup-modal-title"
                aria-describedby="update-setup-modal-description"
                className="
                    flex
                    max-h-[calc(100dvh-2rem)]
                    w-full
                    max-w-3xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    text-[var(--color-text)]
                    shadow-2xl
                "
                onClick={
                    handleDialogClick
                }
            >
                <header
                    className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-[var(--color-border)]
                        px-5
                        py-4
                        sm:px-6
                    "
                >
                    <div className="min-w-0">
                        <h2
                            id="update-setup-modal-title"
                            className="
                                text-lg
                                font-semibold
                                text-[var(--color-text)]
                                sm:text-xl
                            "
                        >
                            {
                                t.edit
                            }
                            {" "}
                            {setup.symbol}
                        </h2>

                        <p
                            id="update-setup-modal-description"
                            className="
                                mt-1
                                text-sm
                                leading-5
                                text-[var(--color-text-secondary)]
                            "
                        >
                            {
                                t.description
                            }
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label={
                            t.close
                        }
                        onClick={
                            onCloseAction
                        }
                        className="
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-[var(--color-text-muted)]
                            transition-colors
                            hover:bg-[var(--color-background)]
                            hover:text-[var(--color-text)]
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[var(--color-brand)]
                            focus-visible:ring-offset-2
                            focus-visible:ring-offset-[var(--color-surface)]
                        "
                    >
                        <X
                            className="size-5"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </button>
                </header>

                <div
                    className="
                        overflow-y-auto
                        px-5
                        py-5
                        sm:px-6
                        sm:py-6
                    "
                >
                    <UpdateSetupForm
                        setup={setup}
                        onSuccessAction={
                            onCloseAction
                        }
                        onCancelAction={
                            onCloseAction
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export {
    UpdateSetupModal,
};