import express from "express";
import multer from "multer";
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
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Customers
router.get("/customer/:id", getCustomerById);

// Orders / Invoices
router.get("/customerOrders", getCustomerOrders);
router.get("/customerOrders/invoice/:invoiceNo", getInvoiceDetailsByInvoiceNo);

const uploadFields = upload.fields([
  { name: "measurementPdf", maxCount: 1 },
  { name: "customerCopyPdf", maxCount: 1 },
  { name: "additionalFiles", maxCount: 10 }, // adjust max as needed
]);
router.post("/customerOrders", uploadFields, createCustomerOrder);

// Product Orders / Products
router.get("/productOrders/invoice/:invoiceNo", getProductOrdersByInvoiceNo);
router.get("/product/:productId", getProductByProductOrderId);

// Sales
router.get("/:cognitoId", getSales);
router.post("/", createSales);

export default router;
