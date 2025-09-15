import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index: auto delete after expiresAt
  },
});

export default mongoose.model("OTP", otpSchema);
