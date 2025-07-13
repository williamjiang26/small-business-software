import { Router } from "express";

import multer from "multer";
import { getProductPhotoByProductId } from "../controllers/productPhotoController";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/:productId", getProductPhotoByProductId);

export default router;
