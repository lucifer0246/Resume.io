// controllers/otpController.js
import OTP from "../model/TempOtp.js";
import transporter from "../config/nodemailer.js";

// ✅ Helper: Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Email Template
const otpEmailTemplate = (otp, title = "Your OTP Code") => `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="color: #2563eb; text-align: center; margin-bottom: 20px;">🔐 ${title}</h2>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Your one-time password (OTP) is:</p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #555; text-align: center;">This OTP will expire in <b>5 minutes</b>. Please do not share it with anyone.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #888; text-align: center;">© ${new Date().getFullYear()} MyResume.io</p>
    </div>
  </div>
`;

// ✅ Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await OTP.deleteMany({ email }); // remove old OTP

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email, otp, expiresAt });

    await transporter.sendMail({
      from: `"MyResume.io" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your OTP Code - MyResume.io",
      html: otpEmailTemplate(otp, "Verify Your Email"),
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

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    await OTP.deleteOne({ _id: record._id }); // cleanup

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

    await OTP.deleteMany({ email });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email, otp, expiresAt });

    await transporter.sendMail({
      from: `"MyResume.io" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your New OTP Code - MyResume.io",
      html: otpEmailTemplate(otp, "Your New OTP Code"),
    });

    return res.json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("resendOtp error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
