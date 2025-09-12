import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// route imports
import salesRoutes from "./routes/salesRoutes";
import managerRoutes from "./routes/managerRoutes";
import globalRoutes from "./routes/globalRoutes";
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
app.use("/sales", authMiddleware(["sales"]), salesRoutes);
app.use("/manager", authMiddleware(["manager"]), managerRoutes);
app.use("/", globalRoutes);

// server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// for deployment module exports app serverless http