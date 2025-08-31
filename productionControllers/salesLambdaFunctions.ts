import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

const prisma = new PrismaClient();

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});



// UPDATE
export const updateCustomerOrder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const invoiceNo = parseInt(req.params.invoiceNo, 10);
   
      const files = req.files as Record<string, Express.Multer.File[]>;
      const uploadFile = async (file?: Express.Multer.File) => {
        if (!file) return null;
        const result = await s3
          .upload({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          })
          .promise();
        return result.Location;
      };
  
      const measurementPdfUrl = await uploadFile(files?.measurementPdf?.[0]);
      const customerCopyPdfUrl = await uploadFile(files?.customerCopyPdf?.[0]);
      const additionalFilesUrls: string[] = [];
  
      for (const file of files?.additionalFiles || []) {
        const url = await uploadFile(file);
        if (url) additionalFilesUrls.push(url);
      }
      console.log("🚀 ~ updateCustomerOrder ~ req.body:", files);
  
      if (!invoiceNo) {
        res.status(400).json({ error: "Missing invoiceNo in params" });
        return;
      }
  
      const updatedCustomerOrder = await prisma.customerOrderDetails.update({
        where: { invoiceNo },
        data: {
          measurementPdf: measurementPdfUrl || null,
          customerCopyPdf: customerCopyPdfUrl || null,
          additionalFiles: additionalFilesUrls,
        },
      });
  
      res.json({
        message: "Customer order updated successfully",
        updatedCustomerOrder,
      });
    } catch (error) {
      console.error("❌ Error updating customer order:", error);
      res.status(500).json({ message: "Error updating Customer Orders", error });
    }
  };