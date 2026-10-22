export type SetupDirection =
    | "LONG"
    | "SHORT";

export type SetupItem = {
    id: string;
    symbol: string;
    direction: SetupDirection;
    isActive: boolean;

    entries: string[];
    takeProfits: string[];
    stopLoss: string | null;

    note: string | null;

    createdAt: Date;
    updatedAt: Date;
};