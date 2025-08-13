import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";

const router = express.Router();
router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.post("/", createManager);
// router.get("/:cognitoId/properties", getManagerProperties);

// get all store's product invoices
// update product invoice


// CRUD for deliveries

export default router;
