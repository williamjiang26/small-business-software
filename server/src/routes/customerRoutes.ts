import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../controllers/customerController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getCustomers);
router.post("/", createCustomer);

router.get("/:id", getCustomerById);
router.delete("/:id", deleteCustomer);
router.put("/:id", updateCustomer);

export default router;
