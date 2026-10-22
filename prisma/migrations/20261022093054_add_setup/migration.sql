-- CreateEnum
CREATE TYPE "SetupDirection" AS ENUM ('LONG', 'SHORT');

-- CreateTable
CREATE TABLE "Setup" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "direction" "SetupDirection" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "entries" TEXT[],
    "takeProfits" TEXT[],
    "stopLoss" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setup_pkey" PRIMARY KEY ("id")
);
