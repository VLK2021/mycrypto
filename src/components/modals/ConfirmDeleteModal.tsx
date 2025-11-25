"use client";

import React from "react";


interface ConfirmDeleteModalProps {
    symbol: string;
    name: string;
    onConfirm: () => void;
    onCancel: () => void;
}


export default function ConfirmDeleteModal({
                                               symbol,
                                               name,
                                               onConfirm,
                                               onCancel,
                                           }: ConfirmDeleteModalProps) {


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 w-[90%] max-w-sm shadow-lg text-center">
                <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">
                    Видалення монети
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-5">
                    Ви дійсно хочете видалити монету{" "}
                    <span className="font-semibold text-[var(--color-text)]">
            {name} ({symbol})
          </span>{" "}
                    з вашого портфеля?
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-border)]/20 transition"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
                    >
                        Видалити
                    </button>
                </div>
            </div>
        </div>
    );
}
