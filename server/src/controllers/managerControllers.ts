import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

      if (order.customerInvoice) {
        invoice = await prisma.customerOrderDetails.findUnique({
          where: { invoiceNo: order.customerInvoice },
        });
      }

      const productDetails = await prisma.productDetails.findUnique({
        where: { id: order.productId },
      });

      let customerOrder = {
        customerInvoice: order.customerInvoice,
        dateOrdered: order.dateOrdered,
        // customer order does not create the product order. customer order is just a ticket. manager creates the product order.
        // manager assigns a product order to a customer order ticket.
        orderNo: order.orderNo,
        status: order.status,
        productId : order.productId,
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
    console.log("🚀 ~ updateCustomerOrdersManager ~ invoiceNo:", invoiceNo)
    
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
      // measurementPdf,
      // customerCopyPdf,
      // additionalFiles,
    } = req.body;
    
    console.log("🚀 ~ updateCustomerOrdersManager ~ req.body:", req.body)
   

    if (!invoiceNo) {
      res.status(400).json({ error: "Missing invoiceNo in params" });
      return;
    }

    if (!productId || !productOrderId) {
      res.status(400).json({ error: "Missing productId or productOrderId" });
      return;
    }

    const [productDetails, productOrder] = await prisma.$transaction([
      // prisma.customerOrderDetails.update({
      //   where: { invoiceNo },
      //   data: {
      //     dateOrdered,
          // measurementPdf,
          // customerCopyPdf,
          // additionalFiles,
      //   },
      // }),
      prisma.productDetails.update({
        where: { id: productId },
        data: {
          type,
          color,
          height,
          width,
          length,
          name,
        },
      }),
      prisma.productOrder.update({
        where: { productOrderId },
        data: {
          orderNo,
          status,
        },
      }),
    ]);

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
