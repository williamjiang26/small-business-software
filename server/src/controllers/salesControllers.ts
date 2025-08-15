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
    const { cognitoId, name, email, phoneNumber, store } = req.body;
    const sales = await prisma.sales.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
        store,
      },
    });

    res.status(201).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sales", error });
  }
};
