"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.get("/", productController_1.getProducts);
router.get("/:id", productController_1.getProductById);
router.put("/:id", productController_1.updateProduct);
router.delete("/:id", productController_1.deleteProduct);
router.post("/", upload.array("photos"), productController_1.createProduct);
exports.default = router;
