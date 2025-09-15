import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

// ================= Helper: Generate JWT =================
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined!");
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // allows localhost cookies
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ success: false, error: "Missing fields" });

  try {
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists)
      return res
        .status(409)
        .json({ success: false, error: "Username or Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    const token = generateToken(newUser._id);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to register user" });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, error: "Missing email/password" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to login user" });
  }
};

// ================= LOGOUT =================
export const logoutUser = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

// ================= AUTH MIDDLEWARE =================
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ success: false, error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

// ================= CHECK USER EXISTS =================
export const checkUserExists = async (req, res) => {
  const { query } = req.query;
  if (!query)
    return res.status(400).json({ success: false, error: "Query is required" });

  try {
    const user = await User.findOne({
      $or: [
        { username: { $regex: `^${query}$`, $options: "i" } },
        { email: { $regex: `^${query}$`, $options: "i" } },
      ],
    });

    res.json({ exists: !!user });
  } catch (error) {
    console.error("Check User Error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // comes from authMiddleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Server error" });
  }
};
