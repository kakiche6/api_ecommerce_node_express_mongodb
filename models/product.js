import mongoose from "mongoose";

const schema = new mongoose.schema({});

export const Product = mongoose.model("Product", schema);
