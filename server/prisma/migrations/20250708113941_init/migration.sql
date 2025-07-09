/*
  Warnings:

  - You are about to drop the `ProductPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductPhoto" DROP CONSTRAINT "ProductPhoto_productId_fkey";

-- AlterTable
ALTER TABLE "ProductDetails" ADD COLUMN     "photos" TEXT[];

-- DropTable
DROP TABLE "ProductPhoto";
