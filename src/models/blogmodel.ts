import mongoose, { Document, Mongoose, Schema } from "mongoose";

const BlogSchema = new Schema({
  title: { type: String, required: true },
  user_id: { type: String, required: true },
  author: { type: String, required: true },
  content: {
    paragraphs: { type: [String], required: false },
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Pending", "Approved", "Cancelled"],
  },
  reason: { type: String, required: false },
  imagePath: { type: String, required: false },
});
const BlogModel = mongoose.model("blog", BlogSchema);
export default BlogModel;
