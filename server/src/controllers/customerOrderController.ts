import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET
export const getCustomerOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const customerOrders = await prisma.customerOrderDetails.findMany({
    });
    res.json(customerOrders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customer orders", error });
  }
};

// CREATE
export const createCustomerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const newCustomerOrder = await prisma.customerOrderDetails.create({
      data,
    });
    res.status(201).json(newCustomerOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating customer order", error });
  }
};

// UPDATE
export const updateCustomerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, ...updateData } = req.body;
    const updatedOrder = await prisma.customerOrderDetails.update({
      where: { id },
      data: updateData,
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating customer order", error });
  }
};

// DELETE
export const deleteCustomerOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    const deletedOrder = await prisma.customerOrderDetails.delete({
      where: { id },
    });
    res.json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer order", error });
  }
};
