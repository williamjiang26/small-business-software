-- CreateEnum
CREATE TYPE "public"."OrderStatusEnum" AS ENUM ('CREATEORDER', 'ORDERPLACED', 'ORDERSHIPPED', 'ORDERRECEIVED', 'ORDERDELIVERED');

-- CreateEnum
CREATE TYPE "public"."ProductEnum" AS ENUM ('Single', 'Double', 'RoundTop', 'RoundTopDouble', 'Window', 'Railing');

-- CreateEnum
CREATE TYPE "public"."ProductOrderStatusEnum" AS ENUM ('PROCESSING', 'ORDERPLACED', 'ENROUTE', 'RECEIVED', 'INSTOCK', 'DELIVERED');

-- CreateTable
CREATE TABLE "public"."Store" (
    "id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Manager" (
    "id" SERIAL NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePic" TEXT,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sales" (
    "id" SERIAL NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerOrderDetails" (
    "invoiceNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dateOrdered" TIMESTAMP(3),
    "storeId" INTEGER NOT NULL,
    "salesId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" "public"."OrderStatusEnum" NOT NULL DEFAULT 'CREATEORDER',
    "measurementPdf" TEXT,
    "customerCopyPdf" TEXT,
    "additionalFiles" TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductDetails" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" "public"."ProductEnum",
    "dateOrdered" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "color" TEXT,
    "height" INTEGER,
    "width" INTEGER,
    "length" INTEGER,
    "price" DOUBLE PRECISION,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductOrder" (
    "productOrderId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderNo" INTEGER,
    "customerInvoice" INTEGER,
    "dateOrdered" TIMESTAMP(3) NOT NULL,
    "section" INTEGER,
    "row" INTEGER,
    "dateStocked" TIMESTAMP(3),
    "dateSold" TIMESTAMP(3),
    "status" "public"."ProductOrderStatusEnum" NOT NULL DEFAULT 'PROCESSING',

    CONSTRAINT "ProductOrder_pkey" PRIMARY KEY ("productOrderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_id_key" ON "public"."Store"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_cognitoId_key" ON "public"."Manager"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_cognitoId_key" ON "public"."Sales"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOrderDetails_invoiceNo_key" ON "public"."CustomerOrderDetails"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOrder_orderNo_key" ON "public"."ProductOrder"("orderNo");

-- AddForeignKey
ALTER TABLE "public"."Sales" ADD CONSTRAINT "Sales_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."Sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOrder" ADD CONSTRAINT "ProductOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOrder" ADD CONSTRAINT "ProductOrder_customerInvoice_fkey" FOREIGN KEY ("customerInvoice") REFERENCES "public"."CustomerOrderDetails"("invoiceNo") ON DELETE SET NULL ON UPDATE CASCADE;
