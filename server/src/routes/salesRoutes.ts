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
  updateCustomerOrder,
} from "../controllers/salesControllers";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "measurementPdf", maxCount: 1 },
  { name: "customerCopyPdf", maxCount: 1 },
  { name: "additionalFiles", maxCount: 10 }, // adjust max as needed
]);
// Customers
router.get("/customer/:id", getCustomerById);

// Orders / Invoices
router.put(
  "/customerOrders/updateInvoice/:invoiceNo",
  uploadFields,
  updateCustomerOrder
);
router.get("/customerOrders", getCustomerOrders);
router.get("/customerOrders/invoice/:invoiceNo", getInvoiceDetailsByInvoiceNo);

router.post("/customerOrders", uploadFields, createCustomerOrder);

// Product Orders / Products
router.get("/productOrders/invoice/:invoiceNo", getProductOrdersByInvoiceNo);
router.get("/product/:productId", getProductByProductOrderId);

// Sales
router.get("/:cognitoId", getSales);
router.post("/", createSales);

export default router;
