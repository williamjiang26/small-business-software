import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customers" });
  }
};

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(req.body, "this is the body");
  try {
    const { name, address, email, phone } = req.body;
    console.log(name, address, email, phone)
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        address,
        email,
        phone,
      },
    });
    res.status(201).json(newCustomer);

  } catch (error) {
    console.error("Customer creation error:", error);
    res.status(500).json({ message: "Error creating customer" });
  }
};
