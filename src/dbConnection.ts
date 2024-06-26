import mongoose from "mongoose";

export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    await mongoose.connect("mongodb://localhost:27017/Trainiac");
    console.log("Connected to MongoDB");
    return mongoose;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
