-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "creacreatedAt" TIMESTAMP(3) NOT NULL,
    "valueTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");
