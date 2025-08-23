import express from "express";
import multer from "multer";

import {
  createManager,
  getCustomerOrdersManager,
  getInventory,
  getManager,
  updateCustomerOrdersManager,
} from "../controllers/managerControllers";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put(
  "/customerOrders/invoice/:invoiceNo",
  upload.fields([{ name: "photos", maxCount: 10 }]),
  updateCustomerOrdersManager
);

router.get("/inventory", getInventory);

router.get("/customerOrders", getCustomerOrdersManager);
router.get("/:cognitoId", getManager);
router.post("/", createManager);

export default router;
