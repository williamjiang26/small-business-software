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
export const getProductPhotoByProductId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid product photo ID" });
      return;
    }
    const product = await prisma.productPhoto.findMany({
      where: { productId: productId },
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

// CREATE

export const createProductPhotobyProductId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = parseInt(req.params.productId, 10);
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
        productId,
        url: photoUrl,
      },
    });
    res.status(201).json(newProductPhoto);
  }
};
// Delete
