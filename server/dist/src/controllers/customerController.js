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
exports.createCustomer = exports.getCustomers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customer.findMany();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customers" });
    }
});
exports.getCustomers = getCustomers;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, "this is the body");
    try {
        const { name, address, email, phone } = req.body;
        console.log(name, address, email, phone);
        const newCustomer = yield prisma.customer.create({
            data: {
                name,
                address,
                email,
                phone,
            },
        });
        res.status(201).json(newCustomer);
    }
    catch (error) {
        console.error("Customer creation error:", error);
        res.status(500).json({ message: "Error creating customer" });
    }
});
exports.createCustomer = createCustomer;
