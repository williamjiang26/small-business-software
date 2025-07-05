import { Router } from "express";
import { getCustomers } from "../controllers/customerController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getCustomers);

export default router;
