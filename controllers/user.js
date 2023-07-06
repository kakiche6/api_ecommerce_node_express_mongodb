import { User } from "../models/user.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect email/password" });
  }

  const isMatched = user.comparePassword(password);

  if (!isMatched) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect email/password" });
  }

  res.status(200).json({
    success: true,
    message: `Welcome Back, ${user.name}`,
  });
};

export const signup = async (req, res) => {
  const { name, email, password, address, city, country, pinCode } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    address,
    city,
    country,
    pinCode,
  });

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    user,
  });
};
