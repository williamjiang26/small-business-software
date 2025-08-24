import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET
export const getStores = async (req: Request, res: Response): Promise<void> => {
  try {
    const stores = await prisma.store.findMany({
      where: {},
    });
    if (stores) {
      res.json(stores);
    } else {
      res.status(404).json({ message: "stores not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stores", error });
  }
};
