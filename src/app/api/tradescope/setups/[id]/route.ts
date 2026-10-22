import { NextRequest } from "next/server";

import {
    createMessageResponse,
    createSuccessResponse,
    handleApiError,
} from "@/helpers";
import {
    setupIdSchema,
    setupStatusSchema,
    updateSetupSchema,
} from "@/schemas/setup.schema";
import {
    deleteSetup,
    getSetupById,
    updateSetup,
    updateSetupStatus,
} from "@/services/setup.service";

type SetupRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export const GET = async (
    _: NextRequest,
    context: SetupRouteContext,
) => {
    try {
        const params = await context.params;
        const { id } = setupIdSchema.parse(params);

        const setup = await getSetupById(id);

        if (!setup) {
            return createMessageResponse(
                "Сетап не знайдено",
                404,
            );
        }

        return createSuccessResponse(setup);
    } catch (error) {
        return handleApiError(
            error,
            "Не вдалося отримати сетап",
        );
    }
};

export const PATCH = async (
    request: NextRequest,
    context: SetupRouteContext,
) => {
    try {
        const params = await context.params;
        const { id } = setupIdSchema.parse(params);

        const body: unknown = await request.json();

        if (
            typeof body === "object" &&
            body !== null &&
            !Array.isArray(body) &&
            Object.keys(body).length === 1 &&
            "isActive" in body
        ) {
            const validatedStatus = setupStatusSchema.parse(body);

            const setup = await updateSetupStatus(
                id,
                validatedStatus,
            );

            return createSuccessResponse(
                setup,
                200,
                "Статус сетапу успішно оновлено",
            );
        }

        const validatedData = updateSetupSchema.parse(body);
        const setup = await updateSetup(id, validatedData);

        return createSuccessResponse(
            setup,
            200,
            "Сетап успішно оновлено",
        );
    } catch (error) {
        return handleApiError(
            error,
            "Не вдалося оновити сетап",
        );
    }
};

export const DELETE = async (
    _: NextRequest,
    context: SetupRouteContext,
) => {
    try {
        const params = await context.params;
        const { id } = setupIdSchema.parse(params);

        await deleteSetup(id);

        return createMessageResponse(
            "Сетап успішно видалено",
        );
    } catch (error) {
        return handleApiError(
            error,
            "Не вдалося видалити сетап",
        );
    }
};