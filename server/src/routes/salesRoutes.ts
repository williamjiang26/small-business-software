import express from "express";
import { getSales, createSales, getCustomerOrders } from "../controllers/salesControllers";

const router = express.Router();

router.get("/customerOrders", getCustomerOrders);
router.get("/:cognitoId", getSales);
router.post("/", createSales);


export default router;
