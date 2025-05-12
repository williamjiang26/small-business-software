import { Router } from "express";
import { getProducts, createProduct } from "../controllers/productController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getProducts);
router.post("/", upload.array("photos"), createProduct);

export default router;
