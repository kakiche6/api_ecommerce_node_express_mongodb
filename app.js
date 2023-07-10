import { config } from "dotenv";
import express from "express";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config({
  path: "./data/config.env",
});

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to ecommerce api");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);

// Error middleware
app.use(errorMiddleware);
