-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('CREATEORDER', 'ORDERPLACED', 'ORDERSHIPPED', 'ORDERRECEIVED', 'ORDERDELIVERED');

-- CreateEnum
CREATE TYPE "ProductEnum" AS ENUM ('Single', 'Double', 'RoundTop', 'RoundTopDouble', 'Window', 'Railing');

-- CreateEnum
CREATE TYPE "ProductOrderStatusEnum" AS ENUM ('PROCESSING', 'ORDERPLACED', 'ENROUTE', 'RECEIVED', 'INSTOCK', 'DELIVERED');

-- CreateTable
CREATE TABLE "Store" (
    "id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrderDetails" (
    "invoiceNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dateOrdered" TIMESTAMP(3),
    "customerId" INTEGER NOT NULL,
    "salesRepId" INTEGER NOT NULL,
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
    "status" TEXT NOT NULL,
    "salesRepId" INTEGER NOT NULL,

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
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
    "status" "ProductOrderStatusEnum" NOT NULL DEFAULT 'PROCESSING',

    CONSTRAINT "ProductOrder_pkey" PRIMARY KEY ("orderNo")
);

-- CreateTable
CREATE TABLE "ProductPhoto" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_id_key" ON "Store"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_cognitoId_key" ON "Manager"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_cognitoId_key" ON "Sales"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_storeId_key" ON "Sales"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOrderDetails_invoiceNo_key" ON "CustomerOrderDetails"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_id_key" ON "ProductDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOrder_orderNo_key" ON "ProductOrder"("orderNo");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_salesRepId_fkey" FOREIGN KEY ("salesRepId") REFERENCES "Sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDetails" ADD CONSTRAINT "ProductDetails_salesRepId_fkey" FOREIGN KEY ("salesRepId") REFERENCES "Sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_customerInvoice_fkey" FOREIGN KEY ("customerInvoice") REFERENCES "CustomerOrderDetails"("invoiceNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPhoto" ADD CONSTRAINT "ProductPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
