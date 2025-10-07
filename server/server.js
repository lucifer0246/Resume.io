import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

import resumeRoutes from "./routes/resumeRoutes.js";
import publicResumeRoutes from "./routes/publicrRoute.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Cookie parser
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

// Middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/public", publicResumeRoutes);

app.use("/resume", resumeRoutes);

app.use("/api/otp", otpRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
