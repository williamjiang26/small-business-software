import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { parse } from "path";

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
    // const files = req.files as Express.Multer.File[];

    console.log("BODY:", req.body); // Form fields
    // console.log("FILES:", req.files);

    const {
      name,
      height,
      width,
      length,
      price,
      color,
      rating,
      quantity,
      managerId,
    } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        height: parseFloat(height),
        width: parseFloat(width),
        length: parseFloat(length),
        price: parseFloat(price),
        color,
        rating: parseFloat(rating),
        quantity: parseInt(quantity),
        managerId: parseInt(managerId),
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};
