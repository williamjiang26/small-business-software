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
exports.getSalesById = exports.getInventory = exports.getInvoiceDetailsByInvoiceNo = exports.getProductByProductOrderId = exports.getProductOrdersByInvoiceNo = exports.getCustomerById = exports.updateCustomerOrder = exports.createCustomerOrder = exports.getCustomerOrders = exports.createSales = exports.getSales = exports.s3 = void 0;
const client_1 = require("@prisma/client");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const prisma = new client_1.PrismaClient();
exports.s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from your AWS IAM
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
// GET
const getSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const sales = yield prisma.sales.findUnique({
            where: { cognitoId },
        });
        if (sales) {
            res.json(sales);
        }
        else {
            res.status(404).json({ message: "Sales not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving sales", error });
    }
});
exports.getSales = getSales;
// CREATE
const createSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId, name, email, phoneNumber, storeId } = req.body;
        console.log("🚀 ~ createSales ~ req.body:", req.body);
        const sales = yield prisma.sales.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber,
                storeId,
            },
        });
        res.status(201).json(sales);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving sales", error });
    }
});
exports.createSales = createSales;
// GET
const getCustomerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeId = parseInt(req.params.storeId, 10) || "";
        const customerOrders = yield prisma.customerOrderDetails.findMany({
            where: { storeId: Number(storeId) },
        });
        if (customerOrders) {
            res.json(customerOrders);
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
exports.getCustomerOrders = getCustomerOrders;
// create customer order
const createCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { invoiceNo, dateOrdered, status, customerId, storeId, salesId, address, name, phone, email, orderSummary, } = req.body;
        console.log("🚀 ~ createCustomerOrder ~ req.body:", req.body);
        if (!invoiceNo ||
            !customerId ||
            !storeId ||
            !salesId ||
            !dateOrdered ||
            !status ||
            !address ||
            !name ||
            !phone ||
            !email) {
            res.status(400).json({ message: "Missing required fields" });
            return; // stop execution
        }
        const parsedDate = new Date(dateOrdered);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({ message: "Invalid dateOrdered format" });
            return;
        }
        // create customer if not exists
        const existingCustomer = yield prisma.customer.findUnique({
            where: { id: Number(customerId) },
        });
        if (!existingCustomer) {
            yield prisma.customer.create({
                data: { id: Number(customerId), name, address, phone, email },
            });
        }
        // handle files ...
        const files = req.files;
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
        const measurementPdfUrl = yield uploadFile((_a = files === null || files === void 0 ? void 0 : files.measurementPdf) === null || _a === void 0 ? void 0 : _a[0]);
        const customerCopyPdfUrl = yield uploadFile((_b = files === null || files === void 0 ? void 0 : files.customerCopyPdf) === null || _b === void 0 ? void 0 : _b[0]);
        const additionalFilesUrls = [];
        for (const file of (files === null || files === void 0 ? void 0 : files.additionalFiles) || []) {
            const url = yield uploadFile(file);
            if (url)
                additionalFilesUrls.push(url);
        }
        // create customer order
        const newCustomerOrder = yield prisma.customerOrderDetails.create({
            data: {
                invoiceNo: Number(invoiceNo),
                customerId: Number(customerId),
                dateOrdered: parsedDate,
                status,
                salesId: Number(salesId),
                storeId: Number(storeId),
                measurementPdf: measurementPdfUrl || null,
                customerCopyPdf: customerCopyPdfUrl || null,
                additionalFiles: additionalFilesUrls,
            },
        });
        // create product orders ...
        for (const order of JSON.parse(orderSummary)) {
            const product = yield prisma.productDetails.create({
                data: {
                    name: order.name,
                    type: order.type,
                    color: order.color,
                    height: order.height,
                    width: order.width,
                    length: order.length,
                },
            });
            yield prisma.productOrder.create({
                data: {
                    productId: product.id,
                    customerInvoice: Number(invoiceNo),
                    dateOrdered: parsedDate,
                },
            });
        }
        res.json(newCustomerOrder); // just send response, do NOT return
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create customer order", error });
    }
});
exports.createCustomerOrder = createCustomerOrder;
// UPDATE
const updateCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const invoiceNo = parseInt(req.params.invoiceNo, 10);
        console.log("🚀 ~ updateCustomerOrder ~ invoiceNo:", invoiceNo);
        const files = req.files;
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
        const measurementPdfUrl = yield uploadFile((_a = files === null || files === void 0 ? void 0 : files.measurementPdf) === null || _a === void 0 ? void 0 : _a[0]);
        const customerCopyPdfUrl = yield uploadFile((_b = files === null || files === void 0 ? void 0 : files.customerCopyPdf) === null || _b === void 0 ? void 0 : _b[0]);
        const additionalFilesUrls = [];
        for (const file of (files === null || files === void 0 ? void 0 : files.additionalFiles) || []) {
            const url = yield uploadFile(file);
            if (url)
                additionalFilesUrls.push(url);
        }
        console.log("🚀 ~ updateCustomerOrder ~ req.body:", files);
        if (!invoiceNo) {
            res.status(400).json({ error: "Missing invoiceNo in params" });
            return;
        }
        const updatedCustomerOrder = yield prisma.customerOrderDetails.update({
            where: { invoiceNo },
            data: {
                measurementPdf: measurementPdfUrl || null,
                customerCopyPdf: customerCopyPdfUrl || null,
                additionalFiles: additionalFilesUrls,
            },
        });
        res.json({
            message: "Customer order updated successfully",
            updatedCustomerOrder,
        });
    }
    catch (error) {
        console.error("❌ Error updating customer order:", error);
        res.status(500).json({ message: "Error updating Customer Orders", error });
    }
});
exports.updateCustomerOrder = updateCustomerOrder;
// get customer by id
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }
        const customer = yield prisma.customer.findUnique({
            where: { id },
        });
        res.json(customer);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
});
exports.getCustomerById = getCustomerById;
// get product orders by invoice No
const getProductOrdersByInvoiceNo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerInvoice = parseInt(req.params.invoiceNo, 10);
        if (isNaN(customerInvoice)) {
            res.status(400).json({ message: "Invalid Customer Invoice No" });
            return;
        }
        const productOrders = yield prisma.productOrder.findMany({
            where: { customerInvoice },
        });
        if (!productOrders) {
            res.status(404).json({ message: "Orders not found" });
            return;
        }
        res.json(productOrders);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving product orders", error });
    }
});
exports.getProductOrdersByInvoiceNo = getProductOrdersByInvoiceNo;
// get product by product order id
const getProductByProductOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId, 10);
        if (isNaN(productId)) {
            res.status(400).json({ message: "Invalid product photo ID" });
            return;
        }
        const product = yield prisma.productDetails.findUnique({
            where: { id: productId },
        });
        if (!product) {
            res.status(404).json({ message: "Orders not found" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving product orders", error });
    }
});
exports.getProductByProductOrderId = getProductByProductOrderId;
// get product by product order id
const getInvoiceDetailsByInvoiceNo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoiceNo = parseInt(req.params.invoiceNo, 10);
        if (isNaN(invoiceNo)) {
            res.status(400).json({ message: "Invalid product photo ID" });
            return;
        }
        const invoice = yield prisma.customerOrderDetails.findUnique({
            where: { invoiceNo },
        });
        console.log("🚀 ~ getInvoiceDetailsByInvoiceNo ~ invoice:", invoice);
        const customer = yield prisma.customer.findUnique({
            where: { id: invoice === null || invoice === void 0 ? void 0 : invoice.customerId },
        });
        const productOrders = yield prisma.productOrder.findMany({
            where: { customerInvoice: invoiceNo },
        });
        console.log("🚀 ~ getInvoiceDetailsByInvoiceNo ~ productOrders:", productOrders);
        let productDetails = [];
        for (let order of productOrders) {
            let product = yield prisma.productDetails.findUnique({
                where: { id: order.productId },
            });
            productDetails.push(product);
        }
        console.log("🚀 ~ getInvoiceDetailsByInvoiceNo ~ productDetails:", productDetails);
        res.json({
            invoiceNo: invoice === null || invoice === void 0 ? void 0 : invoice.invoiceNo,
            createdAt: invoice === null || invoice === void 0 ? void 0 : invoice.createdAt,
            status: invoice === null || invoice === void 0 ? void 0 : invoice.status,
            measurementPdf: invoice === null || invoice === void 0 ? void 0 : invoice.measurementPdf,
            customerCopyPdf: invoice === null || invoice === void 0 ? void 0 : invoice.customerCopyPdf,
            address: customer === null || customer === void 0 ? void 0 : customer.address,
            name: customer === null || customer === void 0 ? void 0 : customer.name,
            phone: customer === null || customer === void 0 ? void 0 : customer.phone,
            email: customer === null || customer === void 0 ? void 0 : customer.email,
            productOrders,
            productDetails,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving product orders", error });
    }
});
exports.getInvoiceDetailsByInvoiceNo = getInvoiceDetailsByInvoiceNo;
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
const getSalesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesId = req.params.id;
        console.log("🚀 ~ getSalesById ~ salesId:", salesId);
        const sales = yield prisma.sales.findUnique({
            where: {
                id: Number(salesId),
            },
        });
        res.json(sales);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving sales", error });
    }
});
exports.getSalesById = getSalesById;
