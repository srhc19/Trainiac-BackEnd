import mongoose, { Document, Mongoose, Schema } from "mongoose";

const ProgressSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentWeight: {
    type: Number,
    required: true,
  },
  waist: {
    type: Number,
    required: true,
  },
  hips: {
    type: Number,
    required: true,
  },
  chest: {
    type: Number,
    required: true,
  },
  arms: {
    type: Number,
    required: true,
  },
  legs: {
    type: Number,
    required: true,
  },
  calves: {
    type: Number,
    required: true,
  },
  forearms: {
    type: Number,
    required: true,
  },
  bodyFatPercentage: {
    type: Number,
    required: true,
  },
  frontPhoto: {
    type: String,
    default: null,
  },
  sidePhoto: {
    type: String,
    default: null,
  },
  backPhoto: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProgressModel = mongoose.model("ProgressTracker", ProgressSchema);
export default ProgressModel;
