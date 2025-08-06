import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

const prisma = new PrismaClient();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

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
    const { color, name, height, width, length, type, price, status, photos } = req.body;
    const updateProduct = await prisma.productDetails.update({
      where: { id },
      data: { color, name, height, width, length, type, price, status, photos },
    });
    res.json(updateProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, color, height, width, length, type, price } = req.body;

    const newProduct = await prisma.productDetails.create({
      data: {
        id: parseInt(id, 10),
        name: name,
        type,
        color,
        height: parseInt(height, 10),
        width: parseInt(width, 10),
        length: parseInt(length, 10),
        price: parseInt(price, 10),
      },
    });
    res.status(201).json(newProduct);

    const files = req.files as Express.Multer.File[];

    for (const file of files) {
      const uploadResult = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: `${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        })
        .promise();

      const photoUrl = uploadResult.Location;

      
      const newProductPhoto = await prisma.productPhoto.create({
        data: {
          productId: parseInt(id, 10),
          url: photoUrl,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleteProductPhoto = await prisma.productPhoto.deleteMany({
      where: { productId: id },
    });
    const deleteProduct = await prisma.productDetails.delete({
      where: { id },
    });
    res.json(deleteProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
