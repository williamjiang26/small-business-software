-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('CREATEORDER', 'ORDERPLACED', 'ORDERSHIPPED', 'ORDERRECEIVED', 'ORDERDELIVERED');

-- CreateEnum
CREATE TYPE "ProductEnum" AS ENUM ('Single', 'Double');

-- CreateTable
CREATE TABLE "CustomerOrderDetails" (
    "invoiceNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dateOrdered" TIMESTAMP(3),
    "customerId" INTEGER NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'CREATEORDER'
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDetails" (
    "id" INTEGER NOT NULL,
    "type" "ProductEnum" NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "ProductOrder" (
    "orderNo" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "section" INTEGER NOT NULL,
    "row" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOrderDetails_invoiceNo_key" ON "CustomerOrderDetails"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_id_key" ON "ProductDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOrder_orderNo_key" ON "ProductOrder"("orderNo");

-- AddForeignKey
ALTER TABLE "CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "CustomerOrderDetails"("invoiceNo") ON DELETE RESTRICT ON UPDATE CASCADE;
