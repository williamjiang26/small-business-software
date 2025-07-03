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
router.post("/", customerOrderController_1.createCustomerOrder);
router.put("/", customerOrderController_1.updateCustomerOrder);
router.delete("/", customerOrderController_1.deleteCustomerOrder);
exports.default = router;
