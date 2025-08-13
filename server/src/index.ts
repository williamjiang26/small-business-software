import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// route imports
import productRoutes from "./routes/productRoutes";
import productOrderRoutes from "./routes/productOrderRoutes";
import productPhotoRoutes from "./routes/productPhotoRoutes";
import customerOrderRoutes from "./routes/customerOrderRoutes";
import customerRoutes from "./routes/customerRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

// configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
app.use("/managers", authMiddleware(["manager"]), managerRoutes);

app.use("/products", productRoutes);
app.use("/productPhotos", productPhotoRoutes);
app.use("/productOrders", productOrderRoutes);
app.use("/customerOrders", customerOrderRoutes);
app.use("/customers", customerRoutes);

// server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
