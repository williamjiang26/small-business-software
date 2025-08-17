import express from "express";
import {
  createManager,
  getCustomerOrdersManager,
  getManager,
  updateCustomerOrdersManager,
} from "../controllers/managerControllers";

const router = express.Router();

router.put("/customerOrders/invoice/:invoiceNo", updateCustomerOrdersManager);
router.get("/customerOrders", getCustomerOrdersManager);
router.get("/:cognitoId", getManager);
router.post("/", createManager);

export default router;
