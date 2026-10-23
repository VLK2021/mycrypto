"use client";

import {useState} from "react";
import {Plus} from "lucide-react";

import {useLanguage} from "@/context";
import {CreateSetupModal} from "@/components/modals/createSetup";
import uk from "@/locales/uk";
import en from "@/locales/en";

const AddSetupButton = () => {
    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[var(--color-brand)]
                    px-5
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    duration-200
                    hover:bg-[var(--color-brand-hover)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--color-brand)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--color-background)]
                    active:scale-[0.99]
                    sm:text-base
                    md:w-auto
                    md:min-w-52
                    lg:min-w-64
                "
            >
                <Plus
                    className="size-5 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                />

                <span>{t.addSetup}</span>
            </button>

            <CreateSetupModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>
    );
};

export {AddSetupButton};