import { Router } from "express";
import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../controllers/productController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/", upload.array("photos"), createProduct);

export default router;
