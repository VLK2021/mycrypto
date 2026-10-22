import {
    z,
} from "zod";

const MAX_PRICE_DECIMAL_PLACES = 9;
const MAX_SETUP_LEVELS = 10;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_LIMIT = 15;
const MAX_PAGE_LIMIT = 50;

const pricePattern = new RegExp(
    `^(?:0|[1-9]\\d*)(?:\\.\\d{1,${MAX_PRICE_DECIMAL_PLACES}})?$`,
);

export const setupPriceSchema = z
    .string()
    .trim()
    .min(
        1,
        "Ціна є обов'язковою",
    )
    .regex(
        pricePattern,
        `Введіть коректну ціну з максимальною точністю ${MAX_PRICE_DECIMAL_PLACES} знаків після крапки`,
    )
    .refine(
        (value) =>
            Number(value) > 0,
        {
            message:
                "Ціна повинна бути більшою за нуль",
        },
    );

export const setupSymbolSchema = z
    .string()
    .trim()
    .min(
        1,
        "Тикер є обов'язковим",
    )
    .max(
        30,
        "Тикер не може містити більше 30 символів",
    )
    .transform((value) =>
        value.toUpperCase(),
    )
    .refine(
        (value) =>
            /^[A-Z0-9]+$/.test(
                value,
            ),
        {
            message:
                "Тикер може містити лише латинські літери та цифри",
        },
    );

export const setupDirectionSchema =
    z.enum([
        "LONG",
        "SHORT",
    ]);

const setupBaseSchema = z.object({
    symbol:
    setupSymbolSchema,

    direction:
    setupDirectionSchema,

    isActive:
        z.boolean(),

    entries: z
        .array(
            setupPriceSchema,
        )
        .min(
            1,
            "Додайте щонайменше один рівень входу",
        )
        .max(
            MAX_SETUP_LEVELS,
            `Можна додати максимум ${MAX_SETUP_LEVELS} рівнів входу`,
        ),

    takeProfits: z
        .array(
            setupPriceSchema,
        )
        .min(
            1,
            "Додайте щонайменше один Take Profit",
        )
        .max(
            MAX_SETUP_LEVELS,
            `Можна додати максимум ${MAX_SETUP_LEVELS} Take Profit`,
        ),

    stopLoss: z
        .union([
            setupPriceSchema,
            z.literal(""),
            z.null(),
        ])
        .optional()
        .transform((value) => {
            if (
                value === "" ||
                value === null ||
                value === undefined
            ) {
                return null;
            }

            return value;
        }),

    note: z
        .union([
            z
                .string()
                .trim()
                .max(
                    1000,
                    "Нотатка не може містити більше 1000 символів",
                ),

            z.null(),
        ])
        .optional()
        .transform((value) => {
            if (!value) {
                return null;
            }

            return value;
        }),
});

export const createSetupSchema =
    setupBaseSchema;

export const updateSetupSchema =
    setupBaseSchema
        .partial()
        .refine(
            (data) =>
                Object.keys(
                    data,
                ).length > 0,
            {
                message:
                    "Передайте хоча б одне поле для оновлення",
            },
        );

export const setupStatusSchema =
    z.object({
        isActive:
            z.boolean(),
    });

export const setupIdSchema =
    z.object({
        id: z.uuid(
            "Некоректний ID сетапу",
        ),
    });

export const setupQuerySchema =
    z.object({
        page: z.coerce
            .number()
            .int()
            .min(1)
            .default(
                DEFAULT_PAGE,
            ),

        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(
                MAX_PAGE_LIMIT,
            )
            .default(
                DEFAULT_PAGE_LIMIT,
            ),

        status: z
            .enum([
                "all",
                "active",
                "inactive",
            ])
            .default("all"),

        direction: z
            .enum([
                "all",
                "LONG",
                "SHORT",
            ])
            .default("all"),

        symbol: z
            .string()
            .trim()
            .transform(
                (value) =>
                    value.toUpperCase(),
            )
            .default(""),

        sort: z
            .enum([
                "createdAt",
                "updatedAt",
                "symbol",
            ])
            .default(
                "createdAt",
            ),

        order: z
            .enum([
                "asc",
                "desc",
            ])
            .default("desc"),
    });

export type CreateSetupInput =
    z.infer<
        typeof createSetupSchema
    >;

export type UpdateSetupInput =
    z.infer<
        typeof updateSetupSchema
    >;

export type SetupStatusInput =
    z.infer<
        typeof setupStatusSchema
    >;

export type SetupQueryInput =
    z.infer<
        typeof setupQuerySchema
    >;