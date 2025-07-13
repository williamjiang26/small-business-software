import { Router } from "express";
import { getProductPhotoById } from "../controllers/productPhotoController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/:id", getProductPhotoById);

export default router;
