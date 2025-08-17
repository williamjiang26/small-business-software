"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salesControllers_1 = require("../controllers/salesControllers");
const router = express_1.default.Router();
// Customers
router.get("/customer/:id", salesControllers_1.getCustomerById);
// Orders / Invoices
router.get("/customerOrders", salesControllers_1.getCustomerOrders);
router.get("/customerOrders/invoice/:invoiceNo", salesControllers_1.getInvoiceDetailsByInvoiceNo);
router.post("/customerOrders", salesControllers_1.createCustomerOrder);
// Product Orders / Products
router.get("/productOrders/invoice/:invoiceNo", salesControllers_1.getProductOrdersByInvoiceNo);
router.get("/product/:productId", salesControllers_1.getProductByProductOrderId);
// Sales
router.get("/:cognitoId", salesControllers_1.getSales);
router.post("/", salesControllers_1.createSales);
exports.default = router;
