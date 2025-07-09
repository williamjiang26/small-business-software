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
exports.updateCustomerOrder = exports.createCustomerOrder = exports.getCustomerOrderById = exports.getCustomerOrders = void 0;
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
        res
            .status(500)
            .json({ message: "Error retrieving customer orders", error });
    }
});
exports.getCustomerOrders = getCustomerOrders;
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
        const { invoiceNo, customerId, dateOrdered, status } = req.body;
        // ✅ Basic validation (optional but recommended)
        if (!invoiceNo || !customerId || !dateOrdered || !status) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        // ✅ Ensure dateOrdered is a valid Date
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
        const _a = req.body, { invoiceNo } = _a, updateData = __rest(_a, ["invoiceNo"]);
        const updatedOrder = yield prisma.customerOrderDetails.update({
            where: { invoiceNo },
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
// export const deleteCustomerOrder = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.body;
//     const deletedOrder = await prisma.customerOrderDetails.delete({
//       where: { id: id },
//     });
//     res.json(deletedOrder);
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting customer order", error });
//   }
// };
