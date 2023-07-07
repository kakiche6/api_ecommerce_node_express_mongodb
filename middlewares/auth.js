import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import { asyncError } from "./error.js";

export const isAuthenticated = asyncError(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(new ErrorHandler("Not authorized", 401));

  const { _id } = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(_id);

  next();
});
