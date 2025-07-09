import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.productDetails.findMany({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    const product = await prisma.productDetails.findUnique({
      where: { id },
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { color, height, width, length, type, price } = req.body;
    const updateProduct = await prisma.productDetails.update({
      where: { id },
      data: { color, height, width, length, type, price },
    });
    res.json(updateProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleteProduct = await prisma.productDetails.delete({
      where: { id },
    });
    res.json(deleteProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { id, color, height, width, length, type, price, photos } = req.body;
    const newProduct = await prisma.productDetails.create({
      data: { id, color, height, width, length, type, price, photos },
    });
    res.status(201).json(newProduct); // return single product
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};
