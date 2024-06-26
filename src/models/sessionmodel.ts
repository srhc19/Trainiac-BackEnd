import mongoose, { Document, Mongoose, Schema } from "mongoose";
import VedioSession from "../entities/vedioSession";

const SessionSchema = new Schema<VedioSession & Document>({
  trainerId: { type: mongoose.Types.ObjectId, required: true },
  clientsId: { type: [mongoose.Types.ObjectId], required: true },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: false },
  currentDate: { type: String, required: true },
  randomId: { type: String, required: true },
});
const SessionModel = mongoose.model<VedioSession & Document>(
  "vedioSession",
  SessionSchema
);

export default SessionModel;
