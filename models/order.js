import mongoose from "mongoose";

const schema = new mongoose.schema({});

export const Order = mongoose.model("Order", schema);
