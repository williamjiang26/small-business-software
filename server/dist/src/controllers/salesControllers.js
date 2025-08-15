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
exports.getCustomerOrders = exports.createSales = exports.getSales = void 0;
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
// GET
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
        console.log("🚀 ~ getCustomerOrders ~ customerOrders:", customerOrders);
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
