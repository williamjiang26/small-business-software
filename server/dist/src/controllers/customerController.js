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
exports.updateCustomer = exports.deleteCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const customers = yield prisma.customer.findMany({});
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
});
exports.getCustomers = getCustomers;
// GET
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid customer ID" });
            return;
        }
        const customers = yield prisma.customer.findUnique({
            where: { id },
        });
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
});
exports.getCustomerById = getCustomerById;
// CREATE
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, address, phone, email } = req.body;
        if (!id || !name || !address || !phone || !email) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const newCustomers = yield prisma.customer.create({
            data: {
                id: id,
                name: name,
                address: address,
                phone: phone,
                email: email,
            },
        });
        res.status(201).json(newCustomers);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
});
exports.createCustomer = createCustomer;
// DELETE;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deletedCustomer = yield prisma.customer.delete({
            where: { id },
        });
        res.json(deletedCustomer);
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting customer", error });
    }
});
exports.deleteCustomer = deleteCustomer;
// UPDATE
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid id number" });
            return;
        }
        const { address, name, phone, email } = req.body;
        const updatedCustomer = yield prisma.customer.update({
            where: { id },
            data: {
                address,
                name,
                phone,
                email,
            },
        });
        res.json(updatedCustomer);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating customer", error });
    }
});
exports.updateCustomer = updateCustomer;
