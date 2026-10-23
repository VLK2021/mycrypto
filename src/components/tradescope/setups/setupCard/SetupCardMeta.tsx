import {
    CalendarDays,
    SquarePen,
} from "lucide-react";

type SetupCardMetaProps = {
    note: string | null;
    createdAt: Date | string;
};

const SetupCardMeta = ({
                           note,
                           createdAt,
                       }: SetupCardMetaProps) => {
    const formattedDate =
        new Intl.DateTimeFormat(
            "uk-UA",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            },
        ).format(
            new Date(createdAt),
        );

    return (
        <div
            className="
                flex
                min-w-0
                items-center
                justify-between
                gap-4
                border-t
                border-[var(--color-border)]
                pt-4
            "
        >
            <div
                className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                "
            >
                <SquarePen
                    className="
                        size-4
                        shrink-0
                        text-[var(--color-text-muted)]
                    "
                    aria-hidden="true"
                />

                <p
                    className="
                        min-w-0
                        overflow-hidden
                        text-ellipsis
                        whitespace-nowrap
                        text-xs
                        text-[var(--color-text-muted)]
                    "
                    title={
                        note ??
                        undefined
                    }
                >
                    {note || "Без нотатки"}
                </p>
            </div>

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    text-xs
                    text-[var(--color-text-muted)]
                "
            >
                <CalendarDays
                    className="size-4"
                    aria-hidden="true"
                />

                <time
                    dateTime={new Date(
                        createdAt,
                    ).toISOString()}
                >
                    {formattedDate}
                </time>
            </div>
        </div>
    );
};

export {SetupCardMeta};