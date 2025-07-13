import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductPhotoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product photo ID" });
      return;
    }
    const product = await prisma.productPhoto.findUnique({
      where: { id },
    });
    if (!product) {
      res.status(404).json({ message: "Product photos not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product photos", error });
  }
};
