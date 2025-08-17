import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const { cognitoId, name, email, phoneNumber } = req.body;
    const sales = await prisma.sales.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
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
    const customerOrders = await prisma.customerOrderDetails.findMany({
      where: {},
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
      address,
      name,
      phone,
      email,
      orderSummary,
      additionalFiles,
    } = req.body;

    if (
      !invoiceNo ||
      !customerId ||
      !dateOrdered ||
      !status ||
      !address ||
      !name ||
      !phone ||
      !email
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // create customer
    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: Number(customerId) },
    });

    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          id: Number(customerId),
          name,
          address,
          phone,
          email,
        },
      });
    }
    // create invoice
    const parsedDate = new Date(dateOrdered);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ message: "Invalid dateOrdered format" });
      return;
    }
    const newCustomerOrder = await prisma.customerOrderDetails.create({
      data: {
        invoiceNo: Number(invoiceNo),
        customerId: Number(customerId),
        dateOrdered: parsedDate,
        status,
      },
    });
    // create product orders
    for (const order of orderSummary) {
      const newProductDetails = await prisma.productDetails.create({
        data: {
          name: name,
          type: order.type,
          color: order.color,
          height: order.height,
          width: order.width,
          length: order.length,
        },
      });
      const newProductOrder = await prisma.productOrder.create({
        data: {
          productId: newProductDetails.id,
          customerInvoice: invoiceNo,
          dateOrdered: parsedDate,
        },
      });
    }

    if (newCustomerOrder) {
      res.json(newCustomerOrder);
    } else {
      res.status(404).json({ message: "Customer Orders not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Customer Orders", error });
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
        where: { id: order.productOrderId },
      });
      productDetails.push(product);
    }

    res.json({
      invoiceNo: invoice?.invoiceNo,
      createdAt: invoice?.createdAt,
      status: invoice?.status,
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
