import mongoose, { Document, Schema } from "mongoose";
import User from "../entities/user";

const userSchema = new Schema<User & Document>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  isblocked: { type: Boolean, required: false },
  isVerified: { type: Boolean, required: false },
  otp: { type: Number, required: false },
  otpExpirationTime: { type: Date, required: false },
});

const UserModel = mongoose.model<User & Document>("User", userSchema);

export default UserModel;
