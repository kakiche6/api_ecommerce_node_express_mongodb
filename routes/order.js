import express from "express";
import {
  createOrder,
  getAdminOrders,
  getOrderDetails,
  geyMyOrders,
  processOrder,
} from "../controllers/order";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/new", isAuthenticated, createOrder);

router.get("/me", isAuthenticated, geyMyOrders);
router.get("/admin", isAuthenticated, isAdmin, getAdminOrders);

router
  .route("/single/:id")
  .get(isAuthenticated, getOrderDetails)
  .put(isAuthenticated, isAdmin, processOrder);

export default router;
