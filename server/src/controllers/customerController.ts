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

// CREATE
export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerId, name, address, phone, email } = req.body;
    const newCustomers = await prisma.customer.create({
      data: {
        id: customerId,
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
