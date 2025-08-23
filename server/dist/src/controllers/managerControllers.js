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
exports.getInventory = exports.updateCustomerOrdersManager = exports.getCustomerOrdersManager = exports.createManager = exports.getManager = exports.s3 = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const prisma = new client_1.PrismaClient();
exports.s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from your AWS IAM
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
// GET
const getManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const manager = yield prisma.manager.findUnique({
            where: { cognitoId },
        });
        if (manager) {
            res.json(manager);
        }
        else {
            res.status(404).json({ message: "Manager not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving manager", error });
    }
});
exports.getManager = getManager;
// CREATE
const createManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId, name, email, phoneNumber } = req.body;
        const manager = yield prisma.manager.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber,
            },
        });
        res.status(201).json(manager);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving manager", error });
    }
});
exports.createManager = createManager;
// GET
const getCustomerOrdersManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newCustomerOrders = [];
        const orders = yield prisma.productOrder.findMany({
            where: {},
        });
        for (let order of orders) {
            let invoice = null;
            if (order.customerInvoice) {
                invoice = yield prisma.customerOrderDetails.findUnique({
                    where: { invoiceNo: order.customerInvoice },
                });
            }
            const customer = yield prisma.customer.findUnique({
                where: { id: invoice === null || invoice === void 0 ? void 0 : invoice.customerId },
            });
            const productDetails = yield prisma.productDetails.findUnique({
                where: { id: order.productId },
            });
            let customerOrder = {
                customerInvoice: order.customerInvoice,
                customerName: customer === null || customer === void 0 ? void 0 : customer.name,
                dateOrdered: order.dateOrdered,
                // customer order does not create the product order. customer order is just a ticket. manager creates the product order.
                // manager assigns a product order to a customer order ticket.
                orderNo: order.orderNo,
                status: order.status,
                productId: order.productId,
                productOrderId: order.productOrderId,
                type: productDetails === null || productDetails === void 0 ? void 0 : productDetails.type,
                name: productDetails === null || productDetails === void 0 ? void 0 : productDetails.name,
                color: productDetails === null || productDetails === void 0 ? void 0 : productDetails.color,
                height: productDetails === null || productDetails === void 0 ? void 0 : productDetails.height,
                width: productDetails === null || productDetails === void 0 ? void 0 : productDetails.width,
                length: productDetails === null || productDetails === void 0 ? void 0 : productDetails.length,
                price: productDetails === null || productDetails === void 0 ? void 0 : productDetails.price,
                measurementPdf: invoice === null || invoice === void 0 ? void 0 : invoice.measurementPdf,
                customerCopyPdf: invoice === null || invoice === void 0 ? void 0 : invoice.customerCopyPdf,
                additionalFiles: invoice === null || invoice === void 0 ? void 0 : invoice.additionalFiles,
            };
            newCustomerOrders.push(customerOrder);
        }
        if (newCustomerOrders.length > 0) {
            res.json(newCustomerOrders);
        }
        else {
            res.status(404).json({ message: "Customer Orders not found" });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving Customer Orders", error });
    }
});
exports.getCustomerOrdersManager = getCustomerOrdersManager;
// UPDATE
const updateCustomerOrdersManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoiceNo = parseInt(req.params.invoiceNo, 10);
        const { orderNo, productId, productOrderId, status, type, name, color, height, width, length, } = req.body;
        if (!invoiceNo) {
            res.status(400).json({ error: "Missing invoiceNo in params" });
            return;
        }
        if (!productId || !productOrderId) {
            res.status(400).json({ error: "Missing productId or productOrderId" });
            return;
        }
        const files = req.files;
        const photos = (files === null || files === void 0 ? void 0 : files.photos) || []; // now it's an array of files
        console.log("🚀 ~ updateCustomerOrdersManager ~ photos:", photos);
        const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
            if (!file)
                return null;
            const result = yield exports.s3
                .upload({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            })
                .promise();
            return result.Location;
        });
        const photoUrls = [];
        for (const file of photos || []) {
            const url = yield uploadFile(file);
            if (url)
                photoUrls.push(url);
        }
        const [productDetails, productOrder] = yield prisma.$transaction([
            prisma.productDetails.update({
                where: { id: Number(productId) },
                data: {
                    type,
                    color,
                    height: Number(height),
                    width: Number(width),
                    length: Number(length),
                    name,
                    photos: photoUrls,
                },
            }),
            prisma.productOrder.update({
                where: { productOrderId: Number(productOrderId) },
                data: {
                    orderNo: Number(orderNo),
                    status,
                },
            }),
        ]);
        // Update customer order status
        // find customer order
        // const invoice = prisma.customerOrderDetails.findUnique({
        //   where: { invoiceNo: invoiceNo },
        // });
        // find each productOrder status
        const products = yield prisma.productOrder.findMany({
            where: { customerInvoice: invoiceNo },
        });
        // update the customer order to be the min of all the product Order statuses
        const invoiceStatusMapping = {
            0: "CREATEORDER",
            1: "ORDERPLACED",
            2: "ORDERSHIPPED",
            3: "ORDERRECEIVED",
            4: "ORDERDELIVERED",
        };
        const orderStatusMapping = {
            PROCESSING: 0,
            ORDERPLACED: 1,
            ENROUTE: 2,
            RECEIVED: 3,
            INSTOCK: 3,
            DELIVERED: 4,
        };
        let minInvoiceStatus = 10;
        for (const productOrder of products) {
            const statusValue = orderStatusMapping[productOrder.status];
            if (statusValue !== undefined) {
                minInvoiceStatus = Math.min(statusValue, minInvoiceStatus);
            }
        }
        if (minInvoiceStatus !== 10) {
            const invoiceStatusMapping = {
                0: client_2.OrderStatusEnum.CREATEORDER,
                1: client_2.OrderStatusEnum.ORDERPLACED,
                2: client_2.OrderStatusEnum.ORDERSHIPPED,
                3: client_2.OrderStatusEnum.ORDERRECEIVED,
                4: client_2.OrderStatusEnum.ORDERDELIVERED,
            };
            const invoiceStatus = invoiceStatusMapping[minInvoiceStatus];
            yield prisma.customerOrderDetails.update({
                where: { invoiceNo },
                data: {
                    status: invoiceStatus,
                },
            });
        }
        res.json({
            message: "Customer order updated successfully",
            // invoice,
            productDetails,
            productOrder,
        });
    }
    catch (error) {
        console.error("❌ Error updating customer order:", error);
        res.status(500).json({ message: "Error updating Customer Orders", error });
    }
});
exports.updateCustomerOrdersManager = updateCustomerOrdersManager;
const getInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.productDetails.findMany({ where: {} });
        if (products.length > 0) {
            res.json(products);
        }
        else {
            res.status(404).json({ message: "Customer Orders not found" });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving Customer Orders", error });
    }
});
exports.getInventory = getInventory;
