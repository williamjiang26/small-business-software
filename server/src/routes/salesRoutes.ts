import express from "express";
import { getSales, createSales } from "../controllers/salesControllers";

const router = express.Router();

router.get("/:cognitoId", getSales);
router.post("/", createSales);

export default router;
