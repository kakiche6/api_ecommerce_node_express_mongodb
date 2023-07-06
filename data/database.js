import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ecomapi",
    });

    console.log(`Server connected to DB`);
  } catch (error) {
    console.log("Error when connecting to DB", error);
    process.exit(1);
  }
};
