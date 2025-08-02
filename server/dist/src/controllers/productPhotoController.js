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
exports.createProductPhotobyProductId = exports.getProductPhotoByProductId = void 0;
const client_1 = require("@prisma/client");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const prisma = new client_1.PrismaClient();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
// GET
const getProductPhotoByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId, 10);
        if (isNaN(productId)) {
            res.status(400).json({ message: "Invalid product photo ID" });
            return;
        }
        const product = yield prisma.productPhoto.findMany({
            where: { productId: productId },
        });
        if (!product) {
            res.status(404).json({ message: "Product photos not found" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving product photos", error });
    }
});
exports.getProductPhotoByProductId = getProductPhotoByProductId;
// CREATE
const createProductPhotobyProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.productId, 10);
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
                productId,
                url: photoUrl,
            },
        });
        res.status(201).json(newProductPhoto);
    }
});
exports.createProductPhotobyProductId = createProductPhotobyProductId;
// Delete
