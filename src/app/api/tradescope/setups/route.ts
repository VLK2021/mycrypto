import { NextRequest, NextResponse } from "next/server";

import {
    createSuccessResponse,
    handleApiError,
} from "@/helpers";
import {
    createSetupSchema,
    setupQuerySchema,
} from "@/schemas/setup.schema";
import {
    createSetup,
    getSetups,
} from "@/services/setup.service";

export const GET = async (request: NextRequest) => {
    try {
        const queryParams = Object.fromEntries(
            request.nextUrl.searchParams.entries(),
        );

        const query = setupQuerySchema.parse(queryParams);
        const result = await getSetups(query);

        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(
            error,
            "Не вдалося отримати список сетапів",
        );
    }
};

export const POST = async (request: NextRequest) => {
    try {
        const body: unknown = await request.json();
        const validatedData = createSetupSchema.parse(body);

        const setup = await createSetup(validatedData);

        return createSuccessResponse(
            setup,
            201,
            "Сетап успішно створено",
        );
    } catch (error) {
        return handleApiError(
            error,
            "Не вдалося створити сетап",
        );
    }
};