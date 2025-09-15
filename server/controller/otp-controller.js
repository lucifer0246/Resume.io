// controllers/otpController.js
import OTP from "../model/";
import transporter from "../utils/transporter.js"; // your nodemailer config

// ✅ Helper: Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Remove any existing OTP for this email
    await OTP.deleteMany({ email });

    // Create new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await OTP.create({ email, otp, expiresAt });

    // Send email
    await transporter.sendMail({
      from: `"MyResume.io" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendOtp error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    // Check expiry
    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id }); // cleanup
      return res.status(400).json({ message: "OTP expired" });
    }

    // Success → delete OTP so it can’t be reused
    await OTP.deleteOne({ _id: record._id });

    return res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Delete old OTP
    await OTP.deleteMany({ email });

    // Create new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email, otp, expiresAt });

    // Send email
    await transporter.sendMail({
      from: `"MyResume.io" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your New OTP Code",
      html: `<p>Your new OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });

    return res.json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("resendOtp error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
