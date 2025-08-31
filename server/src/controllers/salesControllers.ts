import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

const prisma = new PrismaClient();

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
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
// CREATE
export const createSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber, storeId } = req.body;
    const sales = await prisma.sales.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
        storeId,
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
    const storeId = parseInt(req.params.storeId, 10) || "";
    console.log("🚀 ~ getCustomerOrders ~ storeId:", storeId)
    
    const customerOrders = await prisma.customerOrderDetails.findMany({
      where: { storeId: Number(storeId) },
    });
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
// create customer order
export const createCustomerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      invoiceNo,
      dateOrdered,
      status,
      customerId,
      storeId,
      salesId,
      address,
      name,
      phone,
      email,
      orderSummary,
    } = req.body;
 
    if (
      !invoiceNo ||
      !customerId ||
      !storeId ||
      !salesId ||
      !dateOrdered ||
      !status ||
      !address ||
      !name ||
      !phone ||
      !email
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return; // stop execution
    }

    const parsedDate = new Date(dateOrdered);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ message: "Invalid dateOrdered format" });
      return;
    }

    // create customer if not exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: Number(customerId) },
    });
    if (!existingCustomer) {
      await prisma.customer.create({
        data: { id: Number(customerId), name, address, phone, email },
      });
    }

    // handle files ...
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

    // create customer order
    const newCustomerOrder = await prisma.customerOrderDetails.create({
      data: {
        invoiceNo: Number(invoiceNo),
        customerId: Number(customerId),
        dateOrdered: parsedDate,
        status,
        salesId: Number(salesId),

        storeId: Number(storeId),
        measurementPdf: measurementPdfUrl || null,
        customerCopyPdf: customerCopyPdfUrl || null,
        additionalFiles: additionalFilesUrls,
      },
    });

    // create product orders ...
    for (const order of JSON.parse(orderSummary)) {
      const product = await prisma.productDetails.create({
        data: {
          name: order.name,
          type: order.type,
          color: order.color,
          height: order.height,
          width: order.width,
          length: order.length,
        },
      });
      await prisma.productOrder.create({
        data: {
          productId: product.id,
          customerInvoice: Number(invoiceNo),
          dateOrdered: parsedDate,
        },
      });
    }
    res.json(newCustomerOrder); // just send response, do NOT return
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create customer order", error });
  }
};

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
// get customer by id
export const getCustomerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid customer ID" });
      return;
    }
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customers", error });
  }
};
// get product orders by invoice No
export const getProductOrdersByInvoiceNo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customerInvoice = parseInt(req.params.invoiceNo, 10);
    if (isNaN(customerInvoice)) {
      res.status(400).json({ message: "Invalid Customer Invoice No" });
      return;
    }
    const productOrders = await prisma.productOrder.findMany({
      where: { customerInvoice },
    });
    if (!productOrders) {
      res.status(404).json({ message: "Orders not found" });
      return;
    }
    res.json(productOrders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product orders", error });
  }
};
// get product by product order id
export const getProductByProductOrderId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid product photo ID" });
      return;
    }
    const product = await prisma.productDetails.findUnique({
      where: { id: productId },
    });
    if (!product) {
      res.status(404).json({ message: "Orders not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product orders", error });
  }
};

// get product by product order id
export const getInvoiceDetailsByInvoiceNo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceNo = parseInt(req.params.invoiceNo, 10);
    if (isNaN(invoiceNo)) {
      res.status(400).json({ message: "Invalid product photo ID" });
      return;
    }
    const invoice = await prisma.customerOrderDetails.findUnique({
      where: { invoiceNo },
    });
     const customer = await prisma.customer.findUnique({
      where: { id: invoice?.customerId },
    });

    const productOrders = await prisma.productOrder.findMany({
      where: { customerInvoice: invoiceNo },
    });
 

    let productDetails = [];

    for (let order of productOrders) {
      let product = await prisma.productDetails.findUnique({
        where: { id: order.productId },
      });
      productDetails.push(product);
    }
 
    res.json({
      invoiceNo: invoice?.invoiceNo,
      createdAt: invoice?.createdAt,
      status: invoice?.status,
      measurementPdf: invoice?.measurementPdf,
      customerCopyPdf: invoice?.customerCopyPdf,
      address: customer?.address,
      name: customer?.name,
      phone: customer?.phone,
      email: customer?.email,
      productOrders,
      productDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product orders", error });
  }
};

export const getInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.productDetails.findMany({ where: {} });

    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).json({ message: "Customer Orders not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Customer Orders", error });
  }
};

export const getSalesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const salesId = req.params.id;
    const sales = await prisma.sales.findUnique({
      where: {
        id: Number(salesId),
      },
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sales", error });
  }
};
