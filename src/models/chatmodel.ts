import mongoose, { Document, Mongoose, Schema } from "mongoose";
import { Chat } from "../interfaces/userinterface";

const ChatSchema = new Schema<Chat & Document>({
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  read: { type: Boolean, default: false },
});

const ChatModel = mongoose.model<Chat & Document>("Chat", ChatSchema);

export default ChatModel;
