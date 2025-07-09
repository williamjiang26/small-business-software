"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.productDetails.findMany({});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products", error });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }
        const product = yield prisma.productDetails.findUnique({
            where: { id },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving product", error });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { color, height, width, length, type, price } = req.body;
        const updateProduct = yield prisma.productDetails.update({
            where: { id },
            data: { color, height, width, length, type, price },
        });
        res.json(updateProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update product", error });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deleteProduct = yield prisma.productDetails.delete({
            where: { id },
        });
        res.json(deleteProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete product", error });
    }
});
exports.deleteProduct = deleteProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, color, height, width, length, type, price, photos } = req.body;
        const newProduct = yield prisma.productDetails.create({
            data: { id, color, height, width, length, type, price, photos },
        });
        res.status(201).json(newProduct); // return single product
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create product", error });
    }
});
exports.createProduct = createProduct;
