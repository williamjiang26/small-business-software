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
exports.createCustomerOrder = exports.getCustomerOrders = void 0;
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
// export const updateCustomerOrder = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id, ...updateData } = req.body;
//     const updatedOrder = await prisma.customerOrderDetails.update({
//       where: { id },
//       data: updateData,
//     });
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating customer order", error });
//   }
// };
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
