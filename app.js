import { config } from "dotenv";
import express from "express";
import userRoutes from "./routes/user.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

config({
  path: "./data/config.env",
});

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to ecommerce api");
});

app.use("/api/v1/user", userRoutes);

// Error middleware
app.use(errorMiddleware);
