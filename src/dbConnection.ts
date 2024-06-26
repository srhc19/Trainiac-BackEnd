import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    await mongoose.connect(process.env.mongodb as string);
    console.log("Connected to MongoDB");
    return mongoose;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
