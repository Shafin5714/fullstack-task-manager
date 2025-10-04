import mongoose, { Mongoose } from "mongoose";

export const connectDB = async () => {
  try {
    const conn: Mongoose = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    console.log(`MongoDB connected ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`.red.underline.bold);
    process.exit(1);
  }
};
