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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.createProduct = exports.updateProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const prisma = new client_1.PrismaClient();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
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
        const { color, name, height, width, length, type, price, photos } = req.body;
        const updateProduct = yield prisma.productDetails.update({
            where: { id },
            data: { color, name, height, width, length, type, price, photos },
        });
        res.json(updateProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update product", error });
    }
});
exports.updateProduct = updateProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, color, height, width, length, type, price } = req.body;
        const newProduct = yield prisma.productDetails.create({
            data: {
                id: parseInt(id, 10),
                name: name,
                type,
                color,
                height: parseInt(height, 10),
                width: parseInt(width, 10),
                length: parseInt(length, 10),
                price: parseInt(price, 10),
            },
        });
        res.status(201).json(newProduct);
        const files = req.files;
        for (const file of files) {
            const uploadResult = yield s3
                .upload({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            })
                .promise();
            const photoUrl = uploadResult.Location;
            const newProductPhoto = yield prisma.productPhoto.create({
                data: {
                    productId: parseInt(id, 10),
                    url: photoUrl,
                },
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create product", error });
    }
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deleteProductPhoto = yield prisma.productPhoto.deleteMany({
            where: { productId: id },
        });
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
