/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductInstance` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductEnum" AS ENUM ('Single', 'Double');

-- CreateEnum
CREATE TYPE "ColorEnum" AS ENUM ('Black');

-- CreateEnum
CREATE TYPE "HeightEnum" AS ENUM ('H82', 'H96');

-- CreateEnum
CREATE TYPE "WidthEnum" AS ENUM ('W56', 'W74');

-- CreateEnum
CREATE TYPE "LengthEnum" AS ENUM ('L5', 'L7');

-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('CREATEORDER', 'ORDERPLACED', 'ORDERSHIPPED', 'ORDERRECEIVED', 'ORDERDELIVERED');

-- DropForeignKey
ALTER TABLE "ProductInstance" DROP CONSTRAINT "ProductInstance_productId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductInstance";

-- CreateTable
CREATE TABLE "ProductDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "ProductEnum" NOT NULL,
    "color" "ColorEnum" NOT NULL,
    "height" "HeightEnum" NOT NULL,
    "width" "WidthEnum" NOT NULL,
    "length" "LengthEnum" NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "images" TEXT[],

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOrder" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderNo" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "section" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,

    CONSTRAINT "ProductOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrderDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dateOrdered" TIMESTAMP(3),
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'CREATEORDER',
    "customerNotes" TEXT[],
    "customerCopy" TEXT NOT NULL,
    "measurement" TEXT NOT NULL,
    "additionalFiles" TEXT,

    CONSTRAINT "CustomerOrderDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "CustomerOrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
