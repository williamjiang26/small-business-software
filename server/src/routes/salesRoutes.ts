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
  getInventory,
  getSalesById,
  getPresignedURL,
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

router.get("/customerOrders/invoice/:invoiceNo", getInvoiceDetailsByInvoiceNo);
router.get("/customerOrders/:storeId", getCustomerOrders);
router.post("/customerOrders", uploadFields, createCustomerOrder);

// Product Orders / Products
router.get("/inventory", getInventory);
router.get("/productOrders/invoice/:invoiceNo", getProductOrdersByInvoiceNo);
router.get("/product/:productId", getProductByProductOrderId);

// Sales
router.get("/:cognitoId", getSales);
router.get("/id/:id", getSalesById);
router.post("/", createSales);
router.post("/s3/signed-url", getPresignedURL);

export default router;
