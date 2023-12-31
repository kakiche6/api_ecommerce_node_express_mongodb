import mongoose from "mongoose";

const schema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  description: {
    type: String,
    required: [true, "Please enter name"],
  },
  price: {
    type: Number,
    required: [true, "Please enter name"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter name"],
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = new mongoose.model("Product", schema);
