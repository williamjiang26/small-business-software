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
exports.getInvoiceDetailsByInvoiceNo = exports.getProductByProductOrderId = exports.getProductOrdersByInvoiceNo = exports.getCustomerById = exports.createCustomerOrder = exports.getCustomerOrders = exports.createSales = exports.getSales = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
        const { cognitoId, name, email, phoneNumber } = req.body;
        const sales = yield prisma.sales.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber,
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
        const customerOrders = yield prisma.customerOrderDetails.findMany({
            where: {},
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
    try {
        const { invoiceNo, dateOrdered, status, customerId, address, name, phone, email, orderSummary, additionalFiles, } = req.body;
        if (!invoiceNo ||
            !customerId ||
            !dateOrdered ||
            !status ||
            !address ||
            !name ||
            !phone ||
            !email) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        // create customer
        // Check if customer exists
        const existingCustomer = yield prisma.customer.findUnique({
            where: { id: Number(customerId) },
        });
        if (!existingCustomer) {
            yield prisma.customer.create({
                data: {
                    id: Number(customerId),
                    name,
                    address,
                    phone,
                    email,
                },
            });
        }
        // create invoice
        const parsedDate = new Date(dateOrdered);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({ message: "Invalid dateOrdered format" });
            return;
        }
        const newCustomerOrder = yield prisma.customerOrderDetails.create({
            data: {
                invoiceNo: Number(invoiceNo),
                customerId: Number(customerId),
                dateOrdered: parsedDate,
                status,
            },
        });
        // create product orders
        for (const order of orderSummary) {
            const newProductDetails = yield prisma.productDetails.create({
                data: {
                    name: name,
                    type: order.type,
                    color: order.color,
                    height: order.height,
                    width: order.width,
                    length: order.length,
                },
            });
            const newProductOrder = yield prisma.productOrder.create({
                data: {
                    productId: newProductDetails.id,
                    customerInvoice: invoiceNo,
                    dateOrdered: parsedDate,
                },
            });
        }
        if (newCustomerOrder) {
            res.json(newCustomerOrder);
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
exports.createCustomerOrder = createCustomerOrder;
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
        const customer = yield prisma.customer.findUnique({
            where: { id: invoice === null || invoice === void 0 ? void 0 : invoice.customerId },
        });
        const productOrders = yield prisma.productOrder.findMany({
            where: { customerInvoice: invoiceNo },
        });
        let productDetails = [];
        for (let order of productOrders) {
            let product = yield prisma.productDetails.findUnique({
                where: { id: order.productOrderId },
            });
            productDetails.push(product);
        }
        res.json({
            invoiceNo: invoice === null || invoice === void 0 ? void 0 : invoice.invoiceNo,
            createdAt: invoice === null || invoice === void 0 ? void 0 : invoice.createdAt,
            status: invoice === null || invoice === void 0 ? void 0 : invoice.status,
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
