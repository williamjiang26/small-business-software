import { Router } from "express";
import {
  getCustomerOrders,
  createCustomerOrder,
  getCustomerOrderById,
  updateCustomerOrder,
  deleteCustomerOrder,
} from "../controllers/customerOrderController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getCustomerOrders);
router.get("/:invoiceNo", getCustomerOrderById);
router.post("/", createCustomerOrder);
router.put("/:invoiceNo", updateCustomerOrder);
router.delete("/:invoiceNo", deleteCustomerOrder);

export default router;
