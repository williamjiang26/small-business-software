import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

const prisma = new PrismaClient();

// GET
export const getProductOrdersByProductId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid product photo ID" });
      return;
    }
    const product = await prisma.productOrder.findMany({
      where: { productId: productId },
    });
    if (!product) {
      res.status(404).json({ message: "Orders not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product orders", error });
  }
};

// CREATE
export const createProductOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  // get the product id and updates a product order to connect to that id

  const productId = parseInt(req.params.productId, 10);

  const {
    orderNo,
    dateOrdered,
    section,
    row,
    dateStocked,
    dateSold,
    customerInvoice,
  } = req.body;

  console.log("🚀 ~ createProductOrder ~ req.body:", req.body);
  let customerInv;
  if (customerInvoice == 0) {
    customerInv = null;
  } else {
    customerInv = parseInt(customerInvoice, 10);
  }

  const newProductOrder = await prisma.productOrder.create({
    data: {
      orderNo: parseInt(orderNo, 10),
      productId,
      dateOrdered: new Date(dateOrdered),
      dateStocked: new Date(dateStocked),
      dateSold: new Date(dateSold),
      section: parseInt(section, 10),
      row: parseInt(row, 10),
      customerInvoice: customerInv,
    },
  });
  res.status(201).json(newProductOrder);
};

export const deleteProductOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderNo = parseInt(req.params.orderNo, 10);
    console.log("🚀 ~ deleteProductOrder ~ orderNo:", orderNo)
    
    const deleteProductOrder = await prisma.productOrder.delete({
      where: { orderNo },
    });
    res.json(deleteProductOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product order", error });
  }
};
