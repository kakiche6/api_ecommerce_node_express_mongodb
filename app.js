import { config } from "dotenv";
import express from "express";
import userRoutes from "./routes/user.js";

config({
  path: "./data/config.env",
});

export const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to ecommerce api");
});

app.use("/api/v1/user", userRoutes);
