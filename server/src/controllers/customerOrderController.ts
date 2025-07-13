import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET
export const getCustomerOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customerOrders = await prisma.customerOrderDetails.findMany({});
    res.json(customerOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving customer orders", error });
  }
};

export const getCustomerOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceNo = parseInt(req.params.invoiceNo, 10);
    if (isNaN(invoiceNo)) {
      res.status(400).json({ message: "Invalid customer order ID" });
      return;
    }
    const customerOrder = await prisma.customerOrderDetails.findUnique({
      where: { invoiceNo },
    });
    if (!customerOrder) {
      res.status(404).json({ message: "Customer order not found" });
      return;
    }
    res.json(customerOrder);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customer order", error });
  }
};

// CREATE
export const createCustomerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { invoiceNo, customerId, dateOrdered, status } = req.body;

    if (!invoiceNo || !customerId || !dateOrdered || !status) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

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
    res.status(201).json(newCustomerOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating customer order", error });
  }
};

// UPDATE;
export const updateCustomerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceNo = parseInt(req.params.invoiceNo, 10);
    const { customerId, status, dateOrdered } = req.body;

    if (isNaN(invoiceNo)) {
      res.status(400).json({ message: "Invalid invoice number" });
      return;
    }

    const updatedOrder = await prisma.customerOrderDetails.update({
      where: { invoiceNo },
      data: {
        customerId,
        status,
        dateOrdered,
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Error updating customer order",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// DELETE;
export const deleteCustomerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceNo = parseInt(req.params.invoiceNo, 10);
    const deletedOrder = await prisma.customerOrderDetails.delete({
      where: { invoiceNo },
    });
    res.json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer order", error });
  }
};
