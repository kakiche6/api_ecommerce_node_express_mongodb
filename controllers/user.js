import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { cookieOptions, getDataUri, sendToken } from "../utils/features.js";
import cloudinary from "cloudinary";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return next(
      new ErrorHandler("The two fields email and password are required !", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials !"));
  }

  const isMatched = user.comparePassword(password);

  if (!isMatched) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect email/password" });
  }

  sendToken(user, res, `Welcome Back, ${user.name}`, 200);
});

export const signup = asyncError(async (req, res) => {
  const { name, email, password, address, city, country, pinCode } = req.body;

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User already exists", 400));

  let avatar = undefined;

  if (req.file) {
    const file = getDataUri(req.file);

    const myCloud = await cloudinary.v2.uploader.upload(file.content);

    avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  user = await User.create({
    avatar,
    name,
    email,
    password,
    address,
    city,
    country,
    pinCode,
    avatar,
  });

  sendToken(user, res, `Registered successfully`, 201);
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      ...cookieOptions,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const updateProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { name, email, password, address, city, country, pinCode } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  if (address) user.address = address;
  if (city) user.city = city;
  if (country) user.country = country;
  if (pinCode) user.pinCode = pinCode;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

export const changePassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;

  if (!(oldPassword && newPassword)) {
    return next(
      new ErrorHandler(
        "The two fields oldPassword and newPassword are required !",
        400
      )
    );
  }

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) return next(new ErrorHandler("Incorrect old password", 400));

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const updatePic = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const file = getDataUri(req.file);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  user.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Image updated successfully",
  });
});

export const forgetPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Field email required", 404));

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Incorrect Email", 404));

  const randomNumber = Math.random() * (999999 - 1000) + 100000;

  const otp = Math.floor(randomNumber);
  const otp_expire = 15 * 60 * 1000;

  user.otp = otp;
  user.otp_expire = new Date(Date.now() + otp_expire);

  await user.save();

  // Send email

  res.status(200).json({
    success: true,
    message: `Email send successfully to ${user.email}`,
  });
});

export const resetPassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});
