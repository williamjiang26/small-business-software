import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.product.findMany({
      where: search
        ? {
            name: {
              contains: search,
            },
          }
        : {},
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      height,
      width,
      length,
      color,
      quantity,
      price,
      rating,
      ...productData
    } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        ...productData,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};
