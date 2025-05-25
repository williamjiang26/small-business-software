import { Router } from "express";
import { getCustomers, createCustomer } from "../controllers/customerController";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router()

router.get("/", getCustomers)
router.post("/", upload.array("photos"), createCustomer)

export default router