import { NextResponse } from "next/server";
import { ZodError } from "zod";

// import { Prisma } from "@/generated/prisma";
import { Prisma } from "@prisma/client";

type ApiErrorDetails = {
    field: string;
    message: string;
};

export class ApiError extends Error {
    public readonly status: number;
    public readonly details?: ApiErrorDetails[];

    constructor(
        message: string,
        status = 500,
        details?: ApiErrorDetails[],
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

export const createSuccessResponse = <T>(
    data: T,
    status = 200,
    message?: string,
) => {
    return NextResponse.json(
        {
            ...(message ? { message } : {}),
            data,
        },
        {
            status,
        },
    );
};

export const createMessageResponse = (
    message: string,
    status = 200,
) => {
    return NextResponse.json(
        {
            message,
        },
        {
            status,
        },
    );
};

export const handleApiError = (
    error: unknown,
    fallbackMessage: string,
) => {
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                message: "Передані дані не пройшли валідацію",
                errors: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            },
            {
                status: 400,
            },
        );
    }

    if (error instanceof ApiError) {
        return NextResponse.json(
            {
                message: error.message,
                ...(error.details ? { errors: error.details } : {}),
            },
            {
                status: error.status,
            },
        );
    }

    if (error instanceof SyntaxError) {
        return NextResponse.json(
            {
                message: "Тіло запиту містить некоректний JSON",
            },
            {
                status: 400,
            },
        );
    }

    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
    ) {
        return NextResponse.json(
            {
                message: "Сетап не знайдено",
            },
            {
                status: 404,
            },
        );
    }
    console.error(fallbackMessage, error);

    return NextResponse.json(
        {
            message: fallbackMessage,
        },
        {
            status: 500,
        },
    );
};