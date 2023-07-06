import { User } from "../models/user.js";

export const login = (req, res) => {
  res.send("Hello World !");
};

export const signup = async (req, res) => {
  const { name, email, password, address, city, country, pinCode } = req.body;

  await User.create({
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
  });
};
