import mongoose, { Document, Schema } from "mongoose";
import Trainer from "../entities/trainer";

const TrainerSchema: Schema = new Schema<Trainer & Document>({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  description: { type: String, required: false },
  skills: { type: [String], required: false },
  certificates: { type: [String], required: false },
  rating: { type: Number, required: false },
  testimonials: { type: [Object], required: false },
  clients: { type: [String], required: false },
  followers: { type: [String], required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profileimage: { type: String, required: false },
  bannerImage: { type: String, required: false },
  certificateImages: { type: [String], required: false },
  Bio: { type: String, required: false },
  messages: [{ type: String, required: false }],
  premium: {
    paid: { type: Boolean, required: true, default: false },
    method: { type: String, required: false },
    orderid: { type: String, required: false },
  },
  requests: [
    {
      client_id: { type: String, required: false },
      clientName: { type: String, required: false },
      clientEmail: { type: String, required: false },
      goals: { type: [String], required: false },
      createdAt: { type: Date, required: false },
      status: { type: Boolean, required: false, default: false },
    },
  ],
});
const TrainerModel = mongoose.model<Trainer & Document>(
  "Trainer",
  TrainerSchema
);

export default TrainerModel;
