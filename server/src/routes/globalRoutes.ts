import express from "express";
import { getStores } from "../controllers/globalControllers";

const router = express.Router();

// Stores
router.get("/stores", getStores);
export default router;
