"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalControllers_1 = require("../controllers/globalControllers");
const router = express_1.default.Router();
// Stores
router.get("/stores", globalControllers_1.getStores);
exports.default = router;
