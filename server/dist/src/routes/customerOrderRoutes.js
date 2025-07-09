"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerOrderController_1 = require("../controllers/customerOrderController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.get("/", customerOrderController_1.getCustomerOrders);
router.get("/:invoiceNo", customerOrderController_1.getCustomerOrderById);
router.post("/", customerOrderController_1.createCustomerOrder);
router.put("/:invoiceNo", customerOrderController_1.updateCustomerOrder);
// router.delete("/", deleteCustomerOrder);
exports.default = router;
