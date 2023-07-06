import mongoose from "mongoose";

const schema = mongoose.Schema({});

export const Product = new mongoose.model("Product", schema);
