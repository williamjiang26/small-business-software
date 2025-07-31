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
exports.deleteProductOrder = exports.createProductOrder = exports.getProductOrdersByProductId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET
const getProductOrdersByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId, 10);
        if (isNaN(productId)) {
            res.status(400).json({ message: "Invalid product photo ID" });
            return;
        }
        const product = yield prisma.productOrder.findMany({
            where: { productId: productId },
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
exports.getProductOrdersByProductId = getProductOrdersByProductId;
// CREATE
const createProductOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the product id and updates a product order to connect to that id
    const productId = parseInt(req.params.productId, 10);
    const { orderNo, dateOrdered, section, row, dateStocked, dateSold, customerInvoice, } = req.body;
    console.log("🚀 ~ createProductOrder ~ req.body:", req.body);
    let customerInv;
    if (customerInvoice == 0) {
        customerInv = null;
    }
    else {
        customerInv = parseInt(customerInvoice, 10);
    }
    const newProductOrder = yield prisma.productOrder.create({
        data: {
            orderNo: parseInt(orderNo, 10),
            productId,
            dateOrdered: new Date(dateOrdered),
            dateStocked: new Date(dateStocked),
            dateSold: new Date(dateSold),
            section: parseInt(section, 10),
            row: parseInt(row, 10),
            customerInvoice: customerInv,
        },
    });
    res.status(201).json(newProductOrder);
});
exports.createProductOrder = createProductOrder;
const deleteProductOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderNo = parseInt(req.params.orderNo, 10);
        console.log("🚀 ~ deleteProductOrder ~ orderNo:", orderNo);
        const deleteProductOrder = yield prisma.productOrder.delete({
            where: { orderNo },
        });
        res.json(deleteProductOrder);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete product order", error });
    }
});
exports.deleteProductOrder = deleteProductOrder;
