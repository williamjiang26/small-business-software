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
// GET
export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber, store } = req.body;
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
