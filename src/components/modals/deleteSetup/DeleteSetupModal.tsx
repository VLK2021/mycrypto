"use client";

import {
    useEffect,
    useState,
    type MouseEvent,
} from "react";
import {useRouter} from "next/navigation";
import {
    AlertTriangle,
    X,
} from "lucide-react";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

// import {useLanguage} from "@/context";

type DeleteSetupModalProps = {
    isOpen: boolean;
    setupId: string;
    setupSymbol: string;
    onCloseAction: () => void;
};

const getResponseMessage = (
    responseBody: unknown,
    fallback: string,
) => {
    if (
        typeof responseBody === "object" &&
        responseBody !== null &&
        "message" in responseBody &&
        typeof responseBody.message ===
        "string"
    ) {
        return responseBody.message;
    }

    return fallback;
};

const DeleteSetupModal = ({
                              isOpen,
                              setupId,
                              setupSymbol,
                              onCloseAction,
                          }: DeleteSetupModalProps) => {
    const router = useRouter();
    // const {locale} = useLanguage();

    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    const [isDeleting, setIsDeleting] =
        useState(false);

    const [deleteError, setDeleteError] =
        useState("");

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
                event.key === "Escape" &&
                !isDeleting
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
        isDeleting,
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

    const handleOverlayClick = () => {
        if (isDeleting) {
            return;
        }

        onCloseAction();
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setDeleteError("");

            const response = await fetch(
                `/api/setups/${setupId}`,
                {
                    method: "DELETE",
                },
            );

            const responseBody: unknown =
                await response.json();

            if (!response.ok) {
                setDeleteError(
                    getResponseMessage(
                        responseBody,
                        t.deleteError,
                    ),
                );

                return;
            }

            onCloseAction();
            router.refresh();
        } catch {
            setDeleteError(
                    t.connectionError,
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[110]
                flex
                items-center
                justify-center
                bg-black/60
                p-4
                backdrop-blur-sm
            "
            onClick={handleOverlayClick}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-setup-title"
                aria-describedby="delete-setup-description"
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    shadow-2xl
                "
                onClick={handleDialogClick}
            >
                <header
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-[var(--color-border)]
                        px-5
                        py-4
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-start
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                size-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)]
                                text-[var(--color-danger)]
                            "
                        >
                            <AlertTriangle
                                className="size-5"
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="delete-setup-title"
                                className="
                                    text-lg
                                    font-semibold
                                    text-[var(--color-text)]
                                "
                            >
                                {
                                        t.title
                                }
                            </h2>

                            <p
                                id="delete-setup-description"
                                className="
                                    mt-1
                                    text-sm
                                    leading-5
                                    text-[var(--color-text-secondary)]
                                "
                            >
                                {
                                        t.description
                                }{" "}
                                <strong
                                    className="
                                        font-semibold
                                        text-[var(--color-text)]
                                    "
                                >
                                    {setupSymbol}
                                </strong>
                                ?
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label={
                                t.close
                        }
                        disabled={isDeleting}
                        onClick={onCloseAction}
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
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <X
                            className="size-5"
                            aria-hidden="true"
                        />
                    </button>
                </header>

                <div className="px-5 py-5">
                    <p
                        className="
                            text-sm
                            leading-6
                            text-[var(--color-text-secondary)]
                        "
                    >
                        {
                                t.warning
                        }
                    </p>

                    {deleteError ? (
                        <div
                            role="alert"
                            className="
                                mt-4
                                rounded-xl
                                border
                                border-[var(--color-danger)]
                                bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)]
                                px-4
                                py-3
                                text-sm
                                text-[var(--color-danger)]
                            "
                        >
                            {deleteError}
                        </div>
                    ) : null}
                </div>

                <footer
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-[var(--color-border)]
                        px-5
                        py-4
                    "
                >
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onCloseAction}
                        className="
                            h-10
                            rounded-xl
                            border
                            border-[var(--color-border)]
                            px-4
                            text-sm
                            font-medium
                            text-[var(--color-text-secondary)]
                            transition-colors
                            hover:bg-[var(--color-background)]
                            hover:text-[var(--color-text)]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {
                                t.cancel
                        }
                    </button>

                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="
                            flex
                            h-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-[var(--color-danger)]
                            px-4
                            text-sm
                            font-medium
                            text-white
                            transition-opacity
                            hover:opacity-90
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {isDeleting
                            ?
                                t.deleting
                            : t.delete}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export {DeleteSetupModal};