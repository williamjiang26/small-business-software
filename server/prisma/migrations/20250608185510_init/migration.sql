/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `managerId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Driver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesRep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DriverOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StaffOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_salesRepId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_managerId_fkey";

-- DropForeignKey
ALTER TABLE "_DriverOrders" DROP CONSTRAINT "_DriverOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_DriverOrders" DROP CONSTRAINT "_DriverOrders_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_StaffOrders" DROP CONSTRAINT "_StaffOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_StaffOrders" DROP CONSTRAINT "_StaffOrders_B_fkey";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "managerId",
DROP COLUMN "productId",
DROP COLUMN "quantity",
DROP COLUMN "rating",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Driver";

-- DropTable
DROP TABLE "Manager";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "SalesRep";

-- DropTable
DROP TABLE "Staff";

-- DropTable
DROP TABLE "_DriverOrders";

-- DropTable
DROP TABLE "_OrderToProduct";

-- DropTable
DROP TABLE "_StaffOrders";

-- DropEnum
DROP TYPE "OrderStatus";

-- CreateTable
CREATE TABLE "ProductInstance" (
    "id" SERIAL NOT NULL,
    "dateOrdered" TIMESTAMP(3) NOT NULL,
    "section" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductInstance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductInstance" ADD CONSTRAINT "ProductInstance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
