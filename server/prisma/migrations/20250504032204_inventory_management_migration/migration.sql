-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Started', 'Fulfilled');

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrls" TEXT[],
    "height" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "managerId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" SERIAL NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "customerId" INTEGER NOT NULL,
    "salesRepId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customerId" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "Manager" (
    "managerId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile" TEXT,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("managerId")
);

-- CreateTable
CREATE TABLE "Staff" (
    "staffId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("staffId")
);

-- CreateTable
CREATE TABLE "SalesRep" (
    "salesRepId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "SalesRep_pkey" PRIMARY KEY ("salesRepId")
);

-- CreateTable
CREATE TABLE "Driver" (
    "driverId" SERIAL NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("driverId")
);

-- CreateTable
CREATE TABLE "_OrderToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StaffOrders" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StaffOrders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DriverOrders" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DriverOrders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE INDEX "_OrderToProduct_B_index" ON "_OrderToProduct"("B");

-- CreateIndex
CREATE INDEX "_StaffOrders_B_index" ON "_StaffOrders"("B");

-- CreateIndex
CREATE INDEX "_DriverOrders_B_index" ON "_DriverOrders"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("managerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_salesRepId_fkey" FOREIGN KEY ("salesRepId") REFERENCES "SalesRep"("salesRepId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProduct" ADD CONSTRAINT "_OrderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProduct" ADD CONSTRAINT "_OrderToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffOrders" ADD CONSTRAINT "_StaffOrders_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffOrders" ADD CONSTRAINT "_StaffOrders_B_fkey" FOREIGN KEY ("B") REFERENCES "Staff"("staffId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverOrders" ADD CONSTRAINT "_DriverOrders_A_fkey" FOREIGN KEY ("A") REFERENCES "Driver"("driverId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverOrders" ADD CONSTRAINT "_DriverOrders_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
