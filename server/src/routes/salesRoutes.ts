import express from "express";
import {
  getSales,
  createSales,
  getCustomerOrders,
  createCustomerOrder,
  getCustomerById,
  getProductOrdersByInvoiceNo,
  getProductByProductOrderId,
  getInvoiceDetailsByInvoiceNo,
} from "../controllers/salesControllers";

const router = express.Router();

// Customers
router.get("/customer/:id", getCustomerById);

// Orders / Invoices
router.get("/customerOrders", getCustomerOrders);
router.get("/customerOrders/invoice/:invoiceNo", getInvoiceDetailsByInvoiceNo);
router.post("/customerOrders", createCustomerOrder);

// Product Orders / Products
router.get("/productOrders/invoice/:invoiceNo", getProductOrdersByInvoiceNo);
router.get("/product/:productId", getProductByProductOrderId);

// Sales
router.get("/:cognitoId", getSales);
router.post("/", createSales);

export default router;
