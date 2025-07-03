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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerOrder = exports.updateCustomerOrder = exports.createCustomerOrder = exports.getCustomerOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET
const getCustomerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const customerOrders = yield prisma.customerOrderDetails.findMany({});
        res.json(customerOrders);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customer orders", error });
    }
});
exports.getCustomerOrders = getCustomerOrders;
// CREATE
const createCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const newCustomerOrder = yield prisma.customerOrderDetails.create({
            data,
        });
        res.status(201).json(newCustomerOrder);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating customer order", error });
    }
});
exports.createCustomerOrder = createCustomerOrder;
// UPDATE
const updateCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { id } = _a, updateData = __rest(_a, ["id"]);
        const updatedOrder = yield prisma.customerOrderDetails.update({
            where: { id },
            data: updateData,
        });
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating customer order", error });
    }
});
exports.updateCustomerOrder = updateCustomerOrder;
// DELETE
const deleteCustomerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const deletedOrder = yield prisma.customerOrderDetails.delete({
            where: { id },
        });
        res.json(deletedOrder);
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting customer order", error });
    }
});
exports.deleteCustomerOrder = deleteCustomerOrder;
