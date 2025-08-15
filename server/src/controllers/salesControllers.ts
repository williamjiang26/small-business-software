import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET
export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const sales = await prisma.sales.findUnique({
      where: { cognitoId },
    });
    if (sales) {
      res.json(sales);
    } else {
      res.status(404).json({ message: "Sales not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sales", error });
  }
};
// GET
export const createSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const sales = await prisma.sales.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sales", error });
  }
};

// GET
export const getCustomerOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customerOrders = await prisma.customerOrderDetails.findMany({
      where: {},
    });
    console.log("🚀 ~ getCustomerOrders ~ customerOrders:", customerOrders)
    if (customerOrders) {
      res.json(customerOrders);
    } else {
      res.status(404).json({ message: "Customer Orders not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Customer Orders", error });
  }
};
