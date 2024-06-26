import mongoose, { Document, Mongoose, Schema } from "mongoose";

const PaymentSchema = new Schema({
  user_id: { type: String, required: true },
  method: { type: String, required: true, default: "Razorpay" },
  order_id: { type: String, required: true },

  status: { type: String, required: true, default: "Failed" },
  userEmail: { type: String, required: false },
});
const PaymentModel = mongoose.model("PaymentDetails", PaymentSchema);

export default PaymentModel;
