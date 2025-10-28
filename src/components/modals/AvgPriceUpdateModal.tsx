"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";


interface AvgPriceUpdateModalProps {
    setIsUpdateOpen: (open: boolean) => void;
    symbol: string;
    currentPrice: number;
    currentDate?: string;
    onUpdated?: () => void; // callback після оновлення
}

interface UpdateFormData {
    price: number;
    date: string;
}


export default function AvgPriceUpdateModal({
                                                setIsUpdateOpen,
                                                symbol,
                                                currentPrice,
                                                currentDate,
                                                onUpdated,
                                            }: AvgPriceUpdateModalProps) {
    const { register, handleSubmit, reset } = useForm<UpdateFormData>({
        defaultValues: {
            price: currentPrice || 0,
            date: currentDate || new Date().toISOString().split("T")[0],
        },
    });

    useEffect(() => {
        reset({
            price: currentPrice,
            date: currentDate || new Date().toISOString().split("T")[0],
        });
    }, [currentPrice, currentDate, reset]);


    const onSubmit = async (data: UpdateFormData) => {
        try {
            const res = await fetch("/api/manual-average-price", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symbol,
                    price: parseFloat(data.price.toString()),
                    date: data.date,
                }),
            });

            if (!res.ok) throw new Error("Failed to update average price");

            console.log(`✅ Updated ${symbol} average price`);
            onUpdated?.();
            setIsUpdateOpen(false);
        } catch (err) {
            console.error("❌ Update error:", err);
        }
    };


    return (
        <>
            {/* 🔹 Фон */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsUpdateOpen(false)}
            />

            {/* 🔹 Модалка */}
            <div
                className="
          fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[90%] max-w-md
          bg-[var(--color-card)] text-[var(--color-text)]
          border border-[var(--color-border)]
          rounded-2xl shadow-2xl p-6
          transition-theme
          animate-[fadeIn_0.25s_ease-out]
        "
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        Update {symbol} Average Price
                    </h2>
                    <button
                        onClick={() => setIsUpdateOpen(false)}
                        className="p-1 rounded hover:bg-[var(--color-border)]/30 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* 🔹 Symbol */}
                    <div>
                        <label className="block text-sm mb-1">Symbol</label>
                        <input
                            value={symbol}
                            disabled
                            className="
                w-full p-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-background)] opacity-70 cursor-not-allowed
              "
                        />
                    </div>

                    {/* 🔹 Price */}
                    <div>
                        <label className="block text-sm mb-1">New Price (USD)</label>
                        <input
                            type="number"
                            step="any"
                            {...register("price", { required: true })}
                            placeholder="Enter new price"
                            className="
                w-full p-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-background)] outline-none
                focus:ring-2 focus:ring-[var(--color-brand)]
              "
                        />
                    </div>

                    {/* 🔹 Date */}
                    <div>
                        <label className="block text-sm mb-1">Date</label>
                        <input
                            type="date"
                            {...register("date", { required: true })}
                            className="
                w-full p-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-background)] outline-none
                focus:ring-2 focus:ring-[var(--color-brand)]
              "
                        />
                    </div>

                    <button
                        type="submit"
                        className="
              mt-2 py-2 rounded-lg font-semibold
              bg-[var(--color-success)] text-white
              hover:opacity-90 transition
            "
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </>
    );
}
