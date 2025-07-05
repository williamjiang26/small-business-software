import { Router } from "express";
import {
  getCustomerOrders,
  createCustomerOrder,
  // updateCustomerOrder,
  // deleteCustomerOrder,
} from "../controllers/customerOrderController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getCustomerOrders);
router.post("/", createCustomerOrder);
// router.put("/", updateCustomerOrder);
// router.delete("/", deleteCustomerOrder);

export default router;
