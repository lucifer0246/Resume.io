import mongoose from "mongoose";
import { nanoid } from "nanoid";

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true }, // 👈 add this
  originalName: { type: String },
  isActive: { type: Boolean, default: false },
  slug: { type: String, sparse: true, default: "abcd" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", resumeSchema);
