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
exports.deleteCustomerOrder = exports.updateCustomerOrder = exports.createCustomerOrder = exports.getCustomerOrderById = exports.getCustomerOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET
const getCustomerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerOrders = yield prisma.customerOrderDetails.findMany({});
        res.json(customerOrders);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving customer orders", error });
    }
});
exports.getCustomerOrders = getCustomerOrders;
// GET BY ID
const getCustomerOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoiceNo = parseInt(req.params.invoiceNo, 10);
        if (isNaN(invoiceNo)) {
            res.status(400).json({ message: "Invalid customer order ID" });
            return;
        }
        const customerOrder = yield prisma.customerOrderDetails.findUnique({
            where: { invoiceNo },
        });
        if (!customerOrder) {
            res.status(404).json({ message: "Customer order not found" });
            return;
        }
        res.json(customerOrder);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customer order", error });
    }
});
exports.getCustomerOrderById = getCustomerOrderById;
// CREATE
const createCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceNo, customerId, dateOrdered, status, address, name, phone, email, orderSummary, additionalFiles, } = req.body;
        console.log("🚀 ~ createCustomerOrder ~ req.body:", req.body);
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
        const parsedDate = new Date(dateOrdered);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({ message: "Invalid dateOrdered format" });
            return;
        }
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
        const newCustomerOrder = yield prisma.customerOrderDetails.create({
            data: {
                invoiceNo: Number(invoiceNo),
                customerId: Number(customerId),
                dateOrdered: parsedDate,
                status,
            },
        });
        for (const order of orderSummary) {
            const newProductDetails = yield prisma.productDetails.create({
                data: {
                    name: name,
                    type: order.type,
                    height: order.height,
                    width: order.width,
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
        res.status(201).json(newCustomerOrder);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating customer order", error });
    }
});
exports.createCustomerOrder = createCustomerOrder;
// UPDATE;
const updateCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoiceNo = parseInt(req.params.invoiceNo, 10);
        const { customerId, status, dateOrdered } = req.body;
        if (isNaN(invoiceNo)) {
            res.status(400).json({ message: "Invalid invoice number" });
            return;
        }
        const updatedOrder = yield prisma.customerOrderDetails.update({
            where: { invoiceNo },
            data: {
                customerId,
                status,
                dateOrdered,
            },
        });
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating customer order",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.updateCustomerOrder = updateCustomerOrder;
// DELETE;
const deleteCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoiceNo = parseInt(req.params.invoiceNo, 10);
        const deletedOrder = yield prisma.customerOrderDetails.delete({
            where: { invoiceNo },
        });
        res.json(deletedOrder);
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting customer order", error });
    }
});
exports.deleteCustomerOrder = deleteCustomerOrder;
