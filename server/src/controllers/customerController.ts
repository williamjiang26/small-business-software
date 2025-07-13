import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET
export const getCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const customers = await prisma.customer.findMany({});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customers", error });
  }
};

// GET
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

    const customers = await prisma.customer.findUnique({
      where: { id },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customers", error });
  }
};

// CREATE
export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, address, phone, email } = req.body;
    if (!id || !name || !address || !phone || !email) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const newCustomers = await prisma.customer.create({
      data: {
        id: id,
        name: name,
        address: address,
        phone: phone,
        email: email,
      },
    });
    res.status(201).json(newCustomers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customers", error });
  }
};

// DELETE;
export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const deletedCustomer = await prisma.customer.delete({
      where: { id },
    });
    res.json(deletedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};

// UPDATE
export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid id number" });
      return;
    }

    const { address, name, phone, email } = req.body;
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        address,
        name,
        phone,
        email,
      },
    });
    
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
};
