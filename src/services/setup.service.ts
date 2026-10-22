
import type { Prisma } from "@prisma/client";

import { ApiError, prisma } from "@/helpers";

import type {
    CreateSetupInput,
    SetupQueryInput,
    SetupStatusInput,
    UpdateSetupInput,
} from "@/schemas/setup.schema";

import { validateSetupMarketData } from "@/validators";

// --------------------------------------------------
// BUILD WHERE FILTER
// --------------------------------------------------

const buildSetupWhere = (
    query: SetupQueryInput,
): Prisma.SetupWhereInput => {

    const where: Prisma.SetupWhereInput = {};

    if (query.status === "active") {
        where.isActive = true;
    }

    if (query.status === "inactive") {
        where.isActive = false;
    }

    if (query.direction !== "all") {
        where.direction = query.direction;
    }

    if (query.symbol) {
        where.symbol = {
            contains: query.symbol,
            mode: "insensitive",
        };
    }

    return where;
};

// --------------------------------------------------
// BUILD SORTING
// --------------------------------------------------

const buildSetupOrderBy = (
    query: SetupQueryInput,
): Prisma.SetupOrderByWithRelationInput => {

    switch (query.sort) {

        case "symbol":
            return {
                symbol: query.order,
            };

        case "updatedAt":
            return {
                updatedAt: query.order,
            };

        case "createdAt":
        default:
            return {
                createdAt: query.order,
            };
    }
};

// --------------------------------------------------
// GET EXISTING SETUP
// --------------------------------------------------

const getExistingSetupOrThrow = async (
    id: string,
) => {

    const setup = await prisma.setup.findUnique({
        where: {
            id,
        },
    });

    if (!setup) {
        throw new ApiError(
            "Сетап не знайдено",
            404,
        );
    }

    return setup;
};

// --------------------------------------------------
// GET SETUPS WITH FILTERS + PAGINATION
// --------------------------------------------------

export const getSetups = async (
    query: SetupQueryInput,
) => {

    const where = buildSetupWhere(query);

    const orderBy = buildSetupOrderBy(query);

    const skip =
        (query.page - 1) * query.limit;

    const [setups, totalItems] =
        await prisma.$transaction([

            prisma.setup.findMany({
                where,
                orderBy,
                skip,
                take: query.limit,
            }),

            prisma.setup.count({
                where,
            }),

        ]);

    const totalPages = Math.ceil(
        totalItems / query.limit,
    );

    return {
        data: setups,

        pagination: {
            page: query.page,
            limit: query.limit,
            totalItems,
            totalPages,
            hasNextPage:
                query.page < totalPages,
            hasPreviousPage:
                query.page > 1,
        },

        filters: {
            status: query.status,
            direction: query.direction,
            symbol: query.symbol,
        },

        sorting: {
            sort: query.sort,
            order: query.order,
        },
    };
};

// --------------------------------------------------
// GET SETUP BY ID
// --------------------------------------------------

export const getSetupById = async (
    id: string,
) => {

    return prisma.setup.findUnique({
        where: {
            id,
        },
    });
};

// --------------------------------------------------
// CREATE SETUP
// --------------------------------------------------

export const createSetup = async (
    data: CreateSetupInput,
) => {

    const symbol =
        await validateSetupMarketData({
            symbol: data.symbol,
            entries: data.entries,
            takeProfits: data.takeProfits,
            stopLoss: data.stopLoss,
        });

    return prisma.setup.create({
        data: {
            symbol,
            direction: data.direction,
            isActive: data.isActive,
            entries: data.entries,
            takeProfits: data.takeProfits,
            stopLoss: data.stopLoss,
            note: data.note,
        },
    });
};

// --------------------------------------------------
// UPDATE SETUP
// --------------------------------------------------

export const updateSetup = async (
    id: string,
    data: UpdateSetupInput,
) => {

    const currentSetup =
        await getExistingSetupOrThrow(id);

    const symbol =
        await validateSetupMarketData({
            symbol:
                data.symbol ??
                currentSetup.symbol,

            entries:
                data.entries ??
                currentSetup.entries,

            takeProfits:
                data.takeProfits ??
                currentSetup.takeProfits,

            stopLoss:
                data.stopLoss !== undefined
                    ? data.stopLoss
                    : currentSetup.stopLoss,
        });

    return prisma.setup.update({
        where: {
            id,
        },

        data: {
            ...data,
            symbol,
        },
    });
};

// --------------------------------------------------
// UPDATE SETUP STATUS
// --------------------------------------------------

export const updateSetupStatus = async (
    id: string,
    data: SetupStatusInput,
) => {

    return prisma.setup.update({
        where: {
            id,
        },

        data: {
            isActive: data.isActive,
        },
    });
};

// --------------------------------------------------
// DELETE SETUP
// --------------------------------------------------

export const deleteSetup = async (
    id: string,
) => {

    return prisma.setup.delete({
        where: {
            id,
        },
    });
};
