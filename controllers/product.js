import { asyncError } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { Category } from "../models/category.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const getAllProducts = asyncError(async (req, res) => {
  const { keyword, category } = req.query;

  const products = await Product.find({
    name: {
      $regex: keyword ? keyword : "",
      $options: "i",
    },
    category: category ? category : undefined,
  });

  res.status(200).json({
    success: true,
    products,
  });
});

export const getAdminProducts = asyncError(async (req, res) => {
  const products = await Product.find({}).populate("category");

  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductDetails = asyncError(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    product,
  });
});

export const createProduct = asyncError(async (req, res) => {
  const { name, description, category, price, stock } = req.body;

  if (!req.file) return next(new ErrorHandler("Please Add Image", 400));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await Product.create({
    name,
    description,
    category,
    price,
    stock,
    images: [image],
  });

  res.status(201).json({
    success: true,
    message: "Product Created Successful",
  });
});

export const updateProduct = asyncError(async (req, res) => {
  const { name, description, category, price, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Updated Successful",
  });
});

export const addProductImage = asyncError(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (!req.file) return next(new ErrorHandler("Please Add Image", 400));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  product.images.push(image);

  await product.save();

  res.status(201).json({
    success: true,
    message: "Image added successfully",
  });
});

export const deleteProductImage = asyncError(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const id = req.query.id;

  if (!id) return next(new ErrorHandler("Please Provide image id", 400));

  let isExist = -1;

  product.images.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });

  if (isExist < 0) return next(new ErrorHandler("Image does not exist", 400));

  await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

  product.images.splice(isExist, 1);

  await product.save();

  res.status(200).json({
    success: true,
    message: "Image Deleted Successfully",
  });
});

export const deleteProduct = asyncError(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  for (let index = 0; index < product.images.length; index++) {
    await cloudinary.v2.uploader.destroy(product.images[index].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const addCategory = asyncError(async (req, res, next) => {
  await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: "Category Added Successfully",
  });
});

export const getAllCategories = asyncError(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    categories,
  });
});

export const deleteCategory = asyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) return next(new ErrorHandler("Category not found", 404));

  const products = await Product.find({ category: category._id });

  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    product.category = undefined;
    await product.save();
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});
