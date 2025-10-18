"use client";

import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {X} from "lucide-react";
import Select, {GroupBase} from "react-select";
import {useLanguage} from "@/context";
import uk from "@/locales/uk";
import en from "@/locales/en";

interface BayModalProps {
    setBuyOpen: (open: boolean) => void;
}

interface BuyFormData {
    symbol: string;
    amount: number;
    price: number;
    date: string;
}

interface OptionType {
    label: string;
    value: string;
}

export default function BayModal({setBuyOpen}: BayModalProps) {
    const {control, register, handleSubmit, reset} = useForm<BuyFormData>({
        defaultValues: {
            symbol: "",
            amount: 0,
            price: 0,
            date: new Date().toISOString().split("T")[0], // поточна дата за замовчуванням
        },
    });

    const {lang} = useLanguage();
    const t = lang === "uk" ? uk : en;

    const [symbols, setSymbols] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                const res = await fetch("/api/binance/symbols");
                const data = await res.json();
                setSymbols(data);
            } catch (err) {
                console.error("Error fetching symbols:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSymbols();
    }, []);

    const onSubmit = async (data: BuyFormData) => {
        try {
            const res = await fetch("/api/transactions/buy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save transaction");
            const result = await res.json();
            console.log("✅ Saved BUY transaction:", result);

            reset();
            setBuyOpen(false);
        } catch (err) {
            console.error("Error:", err);
        }
    };


    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setBuyOpen(false)}
            />

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
                    <h2 className="text-lg font-semibold">{t.buyCrypto}</h2>
                    <button
                        onClick={() => setBuyOpen(false)}
                        className="p-1 rounded hover:bg-[var(--color-border)]/30 transition"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Symbol */}
                    <div>
                        <label className="block text-sm mb-1">{t.selectCrypto}</label>
                        {loading ? (
                            <div className="text-sm text-[var(--color-muted)]">Loading...</div>
                        ) : (
                            <Controller
                                name="symbol"
                                control={control}
                                render={({field}) => (
                                    <Select<OptionType, false, GroupBase<OptionType>>
                                        value={symbols.find((s) => s.value === field.value) || null}
                                        onChange={(option) => field.onChange(option?.value || "")}
                                        options={symbols}
                                        isSearchable
                                        isClearable
                                        placeholder={t.selectCrypto}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                backgroundColor: "var(--color-background)",
                                                borderColor: state.isFocused
                                                    ? "var(--color-brand)"
                                                    : "var(--color-border)",
                                                color: "var(--color-text)",
                                                boxShadow: "none",
                                                ":hover": {borderColor: "var(--color-brand)"},
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                backgroundColor: "var(--color-card)",
                                                zIndex: 9999,
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: "var(--color-text)",
                                            }),
                                            input: (base) => ({
                                                ...base,
                                                color: "var(--color-text)",
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "var(--color-muted)",
                                            }),
                                            clearIndicator: (base) => ({
                                                ...base,
                                                color: "var(--color-text)",
                                                ":hover": {color: "var(--color-error)"},
                                                cursor: "pointer",
                                            }),
                                        }}
                                    />
                                )}
                            />
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm mb-1">{t.amount}</label>
                        <input
                            type="number"
                            step="any"
                            {...register("amount", {required: true})}
                            placeholder="Enter amount"
                            className="
                w-full p-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-background)] outline-none
                focus:ring-2 focus:ring-[var(--color-brand)]
              "
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm mb-1">{t.price} (USD)</label>
                        <input
                            type="number"
                            step="any"
                            {...register("price", {required: true})}
                            placeholder="Enter price"
                            className="
                w-full p-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-background)] outline-none
                focus:ring-2 focus:ring-[var(--color-brand)]
              "
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm mb-1">{t.date}</label>
                        <input
                            type="date"
                            {...register("date", {required: true})}
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
                        {t.confirm}
                    </button>
                </form>
            </div>
        </>
    );
}
