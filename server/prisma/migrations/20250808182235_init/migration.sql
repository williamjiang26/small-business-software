-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('CREATEORDER', 'ORDERPLACED', 'ORDERSHIPPED', 'ORDERRECEIVED', 'ORDERDELIVERED');

-- CreateEnum
CREATE TYPE "ProductOrderStatusEnum" AS ENUM ('PROCESSING', 'ORDERPLACED', 'ENROUTE', 'RECEIVED', 'INSTOCK', 'DELIVERED');

-- CreateEnum
CREATE TYPE "ProductEnum" AS ENUM ('Single', 'Double', 'RoundTop', 'RoundTopDouble', 'Window', 'Railing');

-- CreateTable
CREATE TABLE "CustomerOrderDetails" (
    "invoiceNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dateOrdered" TIMESTAMP(3),
    "customerId" INTEGER NOT NULL,
    "status" "OrderStatusEnum" NOT NULL DEFAULT 'CREATEORDER',
    "measurementPdf" TEXT,
    "customerCopyPdf" TEXT,
    "additionalFiles" TEXT[] DEFAULT ARRAY[]::TEXT[]
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
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" "ProductEnum",
    "dateOrdered" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "color" TEXT,
    "height" INTEGER,
    "width" INTEGER,
    "length" INTEGER,
    "price" DOUBLE PRECISION,
    "status" "ProductOrderStatusEnum" NOT NULL DEFAULT 'PROCESSING',

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPhoto" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOrder" (
    "orderNo" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerInvoice" INTEGER,
    "dateOrdered" TIMESTAMP(3) NOT NULL,
    "section" INTEGER,
    "row" INTEGER,
    "dateStocked" TIMESTAMP(3),
    "dateSold" TIMESTAMP(3),

    CONSTRAINT "ProductOrder_pkey" PRIMARY KEY ("orderNo")
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
ALTER TABLE "ProductPhoto" ADD CONSTRAINT "ProductPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_customerInvoice_fkey" FOREIGN KEY ("customerInvoice") REFERENCES "CustomerOrderDetails"("invoiceNo") ON DELETE SET NULL ON UPDATE CASCADE;
