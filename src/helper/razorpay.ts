import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY as string,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});