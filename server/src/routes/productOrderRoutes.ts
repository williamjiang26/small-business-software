import { Router } from "express";

import multer from "multer";
import {
  getProductOrdersByProductId,
  createProductOrder,
  deleteProductOrder,
  getProductOrderByOrderNo,
  updateProductOrder,
  getProductOrderByInvoiceNo,
} from "../controllers/productOrderController";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/:productId", getProductOrdersByProductId);
router.get("/order/:orderNo", getProductOrderByOrderNo);
router.get("/invoice/:invoiceNo", getProductOrderByInvoiceNo);

router.put("/order/:orderNo", updateProductOrder);
router.post("/:productId", upload.none(), createProductOrder);
router.delete("/:orderNo", deleteProductOrder);
export default router;
