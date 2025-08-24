"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const salesControllers_1 = require("../controllers/salesControllers");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const uploadFields = upload.fields([
    { name: "measurementPdf", maxCount: 1 },
    { name: "customerCopyPdf", maxCount: 1 },
    { name: "additionalFiles", maxCount: 10 }, // adjust max as needed
]);
// Customers
router.get("/customer/:id", salesControllers_1.getCustomerById);
// Orders / Invoices
router.put("/customerOrders/updateInvoice/:invoiceNo", uploadFields, salesControllers_1.updateCustomerOrder);
router.get("/customerOrders/invoice/:invoiceNo", salesControllers_1.getInvoiceDetailsByInvoiceNo);
router.get("/customerOrders/:storeId", salesControllers_1.getCustomerOrders);
router.post("/customerOrders", uploadFields, salesControllers_1.createCustomerOrder);
// Product Orders / Products
router.get("/inventory", salesControllers_1.getInventory);
router.get("/productOrders/invoice/:invoiceNo", salesControllers_1.getProductOrdersByInvoiceNo);
router.get("/product/:productId", salesControllers_1.getProductByProductOrderId);
// Sales
router.get("/:cognitoId", salesControllers_1.getSales);
router.get("/id/:id", salesControllers_1.getSalesById);
router.post("/", salesControllers_1.createSales);
exports.default = router;
