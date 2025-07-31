"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const productOrderController_1 = require("../controllers/productOrderController");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.get("/:productId", productOrderController_1.getProductOrdersByProductId);
router.post("/:productId", upload.none(), productOrderController_1.createProductOrder);
router.delete("/:orderNo", productOrderController_1.deleteProductOrder);
exports.default = router;
