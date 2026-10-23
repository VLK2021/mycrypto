"use client";

import {
    useState,
} from "react";
import {
    useRouter,
} from "next/navigation";

import {
    DeleteSetupModal,
} from "@/components/modals/deleteSetup";
import {
    UpdateSetupModal,
} from "@/components/modals/updateSetup";

import {
    formatSetupPrice,
} from "@/helpers/formatSetupPrice";
import {
    useTickerPrice,
} from "@/hooks/useTickerPrice";
import type {
    SetupItem,
} from "@/types/setup";

import {
    SetupCardActions,
} from "./SetupCardActions";
import {
    SetupCardHeader,
} from "./SetupCardHeader";
import {
    SetupCardMeta,
} from "./SetupCardMeta";

import {
    SetupTargets,
} from "./SetupTargets";
import {SetupEntries} from "@/components/tradescope/setups/setupCard/SetupEntries";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

type SetupCardProps = {
    setup: SetupItem;
};

const SetupCard = ({
                       setup,
                   }: SetupCardProps) => {
    const router =
        useRouter();

    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    const [
        isUpdateModalOpen,
        setIsUpdateModalOpen,
    ] = useState(false);

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(false);

    const [
        isActive,
        setIsActive,
    ] = useState(
        setup.isActive,
    );

    const [
        isUpdatingStatus,
        setIsUpdatingStatus,
    ] = useState(false);

    const [
        statusError,
        setStatusError,
    ] = useState("");

    const {
        price: currentPrice,
        isLoading,
    } = useTickerPrice(
        setup.symbol,
    );

    const handleToggleStatus =
        async (): Promise<void> => {
            if (
                isUpdatingStatus
            ) {
                return;
            }

            const previousStatus =
                isActive;

            const nextStatus =
                !previousStatus;

            setStatusError("");

            setIsActive(
                nextStatus,
            );

            setIsUpdatingStatus(
                true,
            );

            try {
                const response =
                    await fetch(
                        `/api/setups/${setup.id}`,
                        {
                            method:
                                "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify({
                                    isActive:
                                    nextStatus,
                                }),
                        },
                    );

                if (
                    !response.ok
                ) {
                    throw new Error(
                        "Failed to update setup status",
                    );
                }

                router.refresh();
            } catch {
                setIsActive(
                    previousStatus,
                );

                setStatusError(
                    t.statusUpdateError,
                );
            } finally {
                setIsUpdatingStatus(
                    false,
                );
            }
        };

    return (
        <>
            <article
                className="
                    flex
                    h-[370px]
                    min-w-0
                    flex-col
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-card)]
                "
            >
                <div
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                        px-3.5
                        pt-3.5
                    "
                >
                    <SetupCardHeader
                        symbol={
                            setup.symbol
                        }
                        direction={
                            setup.direction
                        }
                        isActive={
                            isActive
                        }
                        isUpdatingStatus={
                            isUpdatingStatus
                        }
                        onToggleStatusAction={
                            handleToggleStatus
                        }
                    />

                    {statusError ? (
                        <p
                            role="alert"
                            className="
                                mt-2
                                rounded-lg
                                border
                                border-[color-mix(in_srgb,var(--color-danger)_25%,transparent)]
                                bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)]
                                px-2.5
                                py-1.5
                                text-xs
                                text-[var(--color-danger)]
                            "
                        >
                            {
                                statusError
                            }
                        </p>
                    ) : null}

                    <div
                        className="
                            mt-3
                            flex
                            min-w-0
                            items-baseline
                            gap-2
                        "
                    >
                        <span
                            className="
                                shrink-0
                                text-xs
                                text-[var(--color-text-muted)]
                            "
                        >
                            {
                                t.currentPrice
                            }
                        </span>

                        <span
                            className="
                                min-w-0
                                overflow-hidden
                                text-ellipsis
                                whitespace-nowrap
                                font-mono
                                text-sm
                                font-medium
                                tabular-nums
                                text-[var(--color-text-secondary)]
                            "
                            title={
                                currentPrice ===
                                null
                                    ? undefined
                                    : String(
                                        currentPrice,
                                    )
                            }
                        >
                            {isLoading
                                ? "—"
                                : formatSetupPrice(
                                    currentPrice,
                                )}
                        </span>

                        <span
                            className={`
                                size-1.5
                                shrink-0
                                rounded-full
                                ${
                                isLoading
                                    ? `
                                            animate-pulse
                                            bg-[var(--color-warning)]
                                        `
                                    : `
                                            bg-[var(--color-success)]
                                        `
                            }
                            `}
                            title={
                                isLoading
                                    ? "Підключення"
                                    : "Live"
                            }
                        />
                    </div>

                    <div className="mt-3">
                        <SetupEntries
                            entries={
                                setup.entries
                            }
                            currentPrice={
                                currentPrice
                            }
                        />
                    </div>

                    <div className="mt-3">
                        <SetupTargets
                            stopLoss={
                                setup.stopLoss
                            }
                            takeProfits={
                                setup.takeProfits
                            }
                        />
                    </div>

                    <div
                        className="
                            mt-auto
                            pb-2.5
                        "
                    >
                        <SetupCardMeta
                            note={
                                setup.note
                            }
                            createdAt={
                                setup.createdAt
                            }
                        />
                    </div>
                </div>

                <SetupCardActions
                    onUpdateAction={() => {
                        setIsUpdateModalOpen(
                            true,
                        );
                    }}
                    onDeleteAction={() => {
                        setIsDeleteModalOpen(
                            true,
                        );
                    }}
                />
            </article>

            <UpdateSetupModal
                isOpen={
                    isUpdateModalOpen
                }
                setup={
                    setup
                }
                onCloseAction={() => {
                    setIsUpdateModalOpen(
                        false,
                    );
                }}
            />

            <DeleteSetupModal
                isOpen={
                    isDeleteModalOpen
                }
                setupId={
                    setup.id
                }
                setupSymbol={
                    setup.symbol
                }
                onCloseAction={() => {
                    setIsDeleteModalOpen(
                        false,
                    );
                }}
            />
        </>
    );
};

export {
    SetupCard,
};