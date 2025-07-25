"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.get("/", customerController_1.getCustomers);
router.post("/", customerController_1.createCustomer);
router.get("/:id", customerController_1.getCustomerById);
router.delete("/:id", customerController_1.deleteCustomer);
router.put("/:id", customerController_1.updateCustomer);
exports.default = router;
