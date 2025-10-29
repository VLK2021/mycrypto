-- CreateTable
CREATE TABLE "ManualAveragePrice" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualAveragePrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManualAveragePrice_symbol_key" ON "ManualAveragePrice"("symbol");
