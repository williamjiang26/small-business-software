import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { OrderStatusEnum } from "@prisma/client";
import AWS from "aws-sdk";

const prisma = new PrismaClient();


export const s3 = new AWS.S3({
  // dont need this when deployed on lambda
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// GET
export const getManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const manager = await prisma.manager.findUnique({
      where: { cognitoId },
    });
    if (manager) {
      res.json(manager);
    } else {
      res.status(404).json({ message: "Manager not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving manager", error });
  }
};
// CREATE
export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(manager);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving manager", error });
  }
};
// GET
export const getCustomerOrdersManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let newCustomerOrders = [];

    const orders = await prisma.productOrder.findMany({
      where: {},
    });

    for (let order of orders) {
      let invoice = null;
      let store = null;

      if (order.customerInvoice) {
        invoice = await prisma.customerOrderDetails.findUnique({
          where: { invoiceNo: order.customerInvoice },
        });
        store = await prisma.store.findUnique({
          where: { id: invoice?.storeId },
        });
        console.log("🚀 ~ getCustomerOrdersManager ~ store:", store)
      }
      const customer = await prisma.customer.findUnique({
        where: { id: invoice?.customerId },
      });
      const productDetails = await prisma.productDetails.findUnique({
        where: { id: order.productId },
      });

      let customerOrder = {
        customerInvoice: order.customerInvoice,
        customerName: customer?.name,
        dateOrdered: order.dateOrdered,
        store: store?.address,
        // customer order does not create the product order. customer order is just a ticket. manager creates the product order.
        // manager assigns a product order to a customer order ticket.
        orderNo: order.orderNo,
        status: order.status,
        productId: order.productId,
        productOrderId: order.productOrderId,

        type: productDetails?.type,
        name: productDetails?.name,
        color: productDetails?.color,
        height: productDetails?.height,
        width: productDetails?.width,
        length: productDetails?.length,
        price: productDetails?.price,

        measurementPdf: invoice?.measurementPdf,
        customerCopyPdf: invoice?.customerCopyPdf,
        additionalFiles: invoice?.additionalFiles,
      };

      newCustomerOrders.push(customerOrder);
    }

    if (newCustomerOrders.length > 0) {
      res.json(newCustomerOrders);
    } else {
      res.status(404).json({ message: "Customer Orders not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Customer Orders", error });
  }
};
// UPDATE
export const updateCustomerOrdersManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceNo = parseInt(req.params.invoiceNo, 10);

    const {
      orderNo,
      productId,
      productOrderId,
      status,
      type,
      name,
      color,
      height,
      width,
      length,
    } = req.body;

    if (!invoiceNo) {
      res.status(400).json({ error: "Missing invoiceNo in params" });
      return;
    }

    if (!productId || !productOrderId) {
      res.status(400).json({ error: "Missing productId or productOrderId" });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const photos = files?.photos || []; // now it's an array of files
    console.log("🚀 ~ updateCustomerOrdersManager ~ photos:", photos);

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
    const photoUrls: string[] = [];

    for (const file of photos || []) {
      const url = await uploadFile(file);
      if (url) photoUrls.push(url);
    }

    const [productDetails, productOrder] = await prisma.$transaction([
      prisma.productDetails.update({
        where: { id: Number(productId) },
        data: {
          type,
          color,
          height: Number(height),
          width: Number(width),
          length: Number(length),
          name,
          photos: photoUrls,
        },
      }),
      prisma.productOrder.update({
        where: { productOrderId: Number(productOrderId) },
        data: {
          orderNo: Number(orderNo),
          status,
        },
      }),
    ]);

    // Update customer order status
    // find customer order
    // const invoice = prisma.customerOrderDetails.findUnique({
    //   where: { invoiceNo: invoiceNo },
    // });
    // find each productOrder status
    const products = await prisma.productOrder.findMany({
      where: { customerInvoice: invoiceNo },
    });
    // update the customer order to be the min of all the product Order statuses
    const invoiceStatusMapping: Record<number, string> = {
      0: "CREATEORDER",
      1: "ORDERPLACED",
      2: "ORDERSHIPPED",
      3: "ORDERRECEIVED",
      4: "ORDERDELIVERED",
    };

    const orderStatusMapping = {
      PROCESSING: 0,
      ORDERPLACED: 1,
      ENROUTE: 2,
      RECEIVED: 3,
      INSTOCK: 3,
      DELIVERED: 4,
    };

    let minInvoiceStatus = 10;

    for (const productOrder of products) {
      const statusValue = orderStatusMapping[productOrder.status];
      if (statusValue !== undefined) {
        minInvoiceStatus = Math.min(statusValue, minInvoiceStatus);
      }
    }

    if (minInvoiceStatus !== 10) {
      const invoiceStatusMapping: Record<number, OrderStatusEnum> = {
        0: OrderStatusEnum.CREATEORDER,
        1: OrderStatusEnum.ORDERPLACED,
        2: OrderStatusEnum.ORDERSHIPPED,
        3: OrderStatusEnum.ORDERRECEIVED,
        4: OrderStatusEnum.ORDERDELIVERED,
      };
      const invoiceStatus = invoiceStatusMapping[minInvoiceStatus];
      await prisma.customerOrderDetails.update({
        where: { invoiceNo },
        data: {
          status: invoiceStatus,
        },
      });
    }

    res.json({
      message: "Customer order updated successfully",
      // invoice,
      productDetails,
      productOrder,
    });
  } catch (error) {
    console.error("❌ Error updating customer order:", error);
    res.status(500).json({ message: "Error updating Customer Orders", error });
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
