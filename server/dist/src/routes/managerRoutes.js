"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const managerControllers_1 = require("../controllers/managerControllers");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.put("/customerOrders/invoice/:invoiceNo", upload.fields([{ name: "photos", maxCount: 10 }]), managerControllers_1.updateCustomerOrdersManager);
router.get("/inventory", managerControllers_1.getInventory);
router.get("/customerOrders", managerControllers_1.getCustomerOrdersManager);
router.get("/:cognitoId", managerControllers_1.getManager);
router.post("/", managerControllers_1.createManager);
exports.default = router;
