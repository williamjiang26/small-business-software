import { Router } from "express";

import multer from "multer";
import {
  getProductOrdersByProductId,
  createProductOrder,
  deleteProductOrder,
} from "../controllers/productOrderController";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/:productId", getProductOrdersByProductId);
router.post("/:productId", upload.none(), createProductOrder);
router.delete("/:orderNo", deleteProductOrder)
export default router;
