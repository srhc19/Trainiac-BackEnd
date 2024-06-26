import mongoose, { Document, Mongoose, Schema } from "mongoose";
import Client from "../entities/client";
const cardio = new Schema({
  activity: String,
  intensity: String,
  duration: String,
});

const WorkoutDetailsSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["CARDIO", "GYM", "YOGA", "OTHER", "REST"],
  },
  workoutDate: { type: String, required: true },
  details: {
    type: Schema.Types.Mixed,
    required: false,
  },
});

const ClientSchema = new Schema<Client & Document>({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  description: { type: String, required: false },
  goals: { type: [String], required: false },
  trainers: { type: [String], required: false },
  // Array of workout routines, each with type and details
  workoutRoutines: {
    type: [WorkoutDetailsSchema],
    required: false,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profileimage: { type: String, required: false },
  bannerImage: { type: String, requires: false },
  Bio: { type: String, requires: false },
  followers: [{ type: String, required: false }],
  messages: [{ type: String, required: false }],
  requestSended: [
    {
      trainer_id: { type: String, required: false },
      createdAt: { type: Date, required: false },
      accepted: { type: Boolean, required: false, default: false },
    },
  ],
});

const ClientModel = mongoose.model<Client & Document>("Client", ClientSchema);

export default ClientModel;
