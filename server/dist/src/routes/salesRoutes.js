"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salesControllers_1 = require("../controllers/salesControllers");
const router = express_1.default.Router();
router.get("/customerOrders", salesControllers_1.getCustomerOrders);
router.get("/:cognitoId", salesControllers_1.getSales);
router.post("/", salesControllers_1.createSales);
exports.default = router;
