export default function RsiInformation() {
    return (
        <div className="w-full px-1 md:px-8 flex flex-col gap-6">

            <section
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 md:p-6 flex flex-col gap-6">

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[560px]">
                        <img
                            src="/images/rsi.png"
                            alt="RSI chart example"
                            className="w-full h-auto"
                        />

                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Що таке RSI?
                    </h1>

                    <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed max-w-[1100px]">
                        <strong className="text-[var(--color-text)]">RSI (Relative Strength Index)</strong> — індекс
                        відносної сили. Це осцилятор, який показує силу руху ціни та допомагає визначити
                        <strong className="text-[var(--color-text)]"> перекупленість </strong>
                        або
                        <strong className="text-[var(--color-text)]"> перепроданість </strong>
                        активу.
                    </p>

                    <p className="text-[var(--color-text-muted)] text-base md:text-lg">
                        RSI рухається в діапазоні від <strong className="text-[var(--color-text)]">0 до 100</strong>.
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <div
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6 flex flex-col gap-5">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Діапазон значень
                    </h2>

                    <div className="flex flex-col gap-4 text-sm md:text-base">

                        <div className="flex gap-3 items-start">
                            <span className="w-3 h-3 rounded-full bg-red-400 mt-1.5 shrink-0"/>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                <strong className="text-[var(--color-text)]">RSI 90+</strong> — актив сильно
                                перекуплений. Підвищується ймовірність корекції або зниження ціни.
                            </p>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="w-3 h-3 rounded-full bg-orange-400 mt-1.5 shrink-0"/>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                <strong className="text-[var(--color-text)]">RSI 70+</strong> — зона перекупленості
                                (стандартна).
                            </p>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="w-3 h-3 rounded-full bg-green-400 mt-1.5 shrink-0"/>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                <strong className="text-[var(--color-text)]">RSI 30 і нижче</strong> — зона
                                перепроданості (стандартна).
                            </p>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="w-3 h-3 rounded-full bg-emerald-400 mt-1.5 shrink-0"/>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                <strong className="text-[var(--color-text)]">RSI 10 і нижче</strong> — актив сильно
                                перепроданий. Підвищується ймовірність відскоку ціни.
                            </p>
                        </div>

                    </div>
                </div>

                <div
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6 flex flex-col gap-5">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Дивергенції RSI
                    </h2>

                    <div className="flex flex-col gap-4 text-sm md:text-base">

                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            <span className="text-green-400 font-semibold">
                                Бича дивергенція:
                            </span>{" "}
                            ціна робить новий мінімум, а RSI — більш високий мінімум. Сигнал до можливого розвороту
                            вгору.
                        </p>

                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            <span className="text-red-400 font-semibold">
                                Ведмежа дивергенція:
                            </span>{" "}
                            ціна робить новий максимум, а RSI — більш низький максимум. Сигнал до можливого розвороту
                            вниз.
                        </p>

                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            <span className="text-emerald-400 font-semibold">
                                Прихована бичача дивергенція:
                            </span>{" "}
                            ціна робить більш високий мінімум, RSI — більш низький мінімум. Сигнал продовження
                            висхідного тренду.
                        </p>

                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            <span className="text-orange-400 font-semibold">
                                Прихована ведмежа дивергенція:
                            </span>{" "}
                            ціна робить більш низький максимум, RSI — більш високий максимум. Сигнал продовження
                            низхідного тренду.
                        </p>

                    </div>

                    <p className="text-sm italic text-[var(--color-text-muted)]">
                        Як виявити дивергенцію: порівнюй останні 2–3 екстремуми ціни з відповідними значеннями RSI
                        на тому самому таймфреймі.
                    </p>
                </div>

            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6 flex flex-col gap-5">
                <h2 className="text-xl md:text-2xl font-semibold">
                    RSI Zones
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-green-500/10 p-4 flex flex-col gap-2">
                        <span className="text-green-400 font-semibold">0 — 30</span>
                        <span className="text-[var(--color-text-muted)]">Oversold — можливий відскок ціни</span>
                    </div>

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-blue-500/10 p-4 flex flex-col gap-2">
                        <span className="text-blue-400 font-semibold">30 — 70</span>
                        <span className="text-[var(--color-text-muted)]">Нейтральна зона тренду</span>
                    </div>

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-red-500/10 p-4 flex flex-col gap-2">
                        <span className="text-red-400 font-semibold">70 — 100</span>
                        <span className="text-[var(--color-text-muted)]">Overbought — можливий відкат</span>
                    </div>
                </div>
            </section>

            {/* ДОДАНО НИЖЧЕ, ТВОЄ НЕ ЗМІНЮВАВ */}

            <section
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6 flex flex-col gap-5">
                <h2 className="text-xl md:text-2xl font-semibold">
                    RSI у тренді
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-4 text-[var(--color-text-muted)] leading-relaxed">
                        У сильному <strong className="text-[var(--color-text)]">висхідному тренді</strong> RSI часто
                        рухається у діапазоні <strong className="text-[var(--color-text)]">40–80</strong>.
                        Це означає, що навіть відкат до 40–50 не завжди є слабкістю ринку.
                    </div>

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-4 text-[var(--color-text-muted)] leading-relaxed">
                        У сильному <strong className="text-[var(--color-text)]">низхідному тренді</strong> RSI частіше
                        рухається у межах <strong className="text-[var(--color-text)]">20–60</strong>.
                        Тому значення біля 30 ще не гарантує швидкий розворот вгору.
                    </div>

                </div>
            </section>

            <section
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6 flex flex-col gap-5">
                <h2 className="text-xl md:text-2xl font-semibold">
                    Практичні поради
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-4 text-[var(--color-text-muted)] leading-relaxed">
                        Найкраще RSI працює на
                        <strong className="text-[var(--color-text)]"> 1H, 4H та 1D</strong>,
                        де ринкового шуму менше, ніж на дуже дрібних таймфреймах.
                    </div>

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-4 text-[var(--color-text-muted)] leading-relaxed">
                        RSI краще використовувати разом із
                        <strong className="text-[var(--color-text)]"> рівнями підтримки / опору</strong>,
                        трендом, об’ємом або price action.
                    </div>

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-4 text-[var(--color-text-muted)] leading-relaxed">
                        Найсильніші сигнали зазвичай з’являються при
                        <strong className="text-[var(--color-text)]"> екстремальних значеннях </strong>
                        нижче 10 або вище 90.
                    </div>

                    <div
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-4 text-[var(--color-text-muted)] leading-relaxed">
                        Якщо RSI довго тримається у зоні перекупленості або перепроданості,
                        це може бути ознакою
                        <strong className="text-[var(--color-text)]"> сильного тренду</strong>,
                        а не миттєвого розвороту.
                    </div>

                </div>
            </section>

            <section
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6 flex flex-col gap-5">
                <h2 className="text-xl md:text-2xl font-semibold">
                    Типові помилки
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">

                    <div className="text-[var(--color-text-muted)] leading-relaxed">
                        Вважати, що <strong className="text-[var(--color-text)]">RSI 70</strong> автоматично означає
                        шорт, а <strong className="text-[var(--color-text)]">RSI 30</strong> автоматично означає лонг.
                    </div>

                    <div className="text-[var(--color-text-muted)] leading-relaxed">
                        Ігнорувати тренд. У сильному імпульсі RSI може довго лишатися в екстремальних зонах.
                    </div>

                    <div className="text-[var(--color-text-muted)] leading-relaxed">
                        Використовувати RSI без підтвердження з боку
                        <strong className="text-[var(--color-text)]"> ціни, об’єму або рівнів</strong>.
                    </div>

                    <div className="text-[var(--color-text-muted)] leading-relaxed">
                        Дивитися лише на одне число RSI і не звертати увагу на
                        <strong className="text-[var(--color-text)]"> структуру руху</strong> та дивергенції.
                    </div>

                </div>
            </section>

        </div>
    );
}