import Resume from "../model/Resume.js";
import User from "../model/User.js";
import { cloudinary, uploadFileToCloudinary } from "../config/cloudinary.js";
import { nanoid } from "nanoid";

// ---------------- Upload Resume ----------------
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to Cloudinary
    const result = await uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      `resumes/${req.user.id}`
    );

    // Find existing resumes
    const existingResumes = await Resume.find({ user: req.user.id });
    const activeResume = existingResumes.find((r) => r.isActive);

    // Reuse slug if there is already an active one
    let slug = activeResume ? activeResume.slug : "abcd";

    // Create resume in DB
    const resume = await Resume.create({
      user: req.user.id,
      url: result.secure_url,
      publicId: result.public_id,
      originalName: req.file.originalname,
      format: result.format,
      resourceType: result.resource_type,
      isActive: existingResumes.length === 0,
      slug,
    });

    res.status(201).json({ resume });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

// ---------------- Set Active Resume ----------------
export const setActiveResume = async (req, res) => {
  const { resumeId } = req.params;
  try {
    await Resume.updateMany({ user: req.user.id }, { isActive: false });
    const activeResume = await Resume.findByIdAndUpdate(
      resumeId,
      { isActive: true },
      { new: true }
    );
    if (!activeResume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json({ success: true, activeResume });
  } catch (err) {
    console.error("❌ Set active resume failed:", err);
    res.status(500).json({ error: "Failed to set active resume" });
  }
};

// Get User Resumes (faster with lean)
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean(); // ⚡️ plain objects, faster
    res.status(200).json(resumes);
  } catch (err) {
    console.error("❌ Get resumes failed:", err);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};

// ---------------- Delete Resume ----------------
export const deleteResume = async (req, res) => {
  const { resumeId } = req.params;
  try {
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: "raw",
    });

    // Delete from DB
    await resume.deleteOne();

    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    console.error("❌ Delete resume failed:", err);
    res.status(500).json({ error: "Failed to delete resume" });
  }
};

// ---------------- Download Resume ----------------
export const downloadResume = async (req, res) => {
  const { resumeId } = req.params;
  try {
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.redirect(resume.url);
  } catch (err) {
    console.error("❌ Download resume failed:", err);
    res.status(500).json({ error: "Failed to download resume" });
  }
};

// Public Resume (return plain object)
// GET /public/:username
export const getPublicResume = async (req, res) => {
  const { username } = req.params;

  try {
    // 1. Find user by username
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Find active resume for that user
    const resume = await Resume.findOne({
      user: user._id,
      isActive: true,
    }).lean(); // fast plain JS object

    if (!resume) {
      return res.status(404).json({ error: "No active resume" });
    }

    // 3. Return full resume object + basic user info
    res.json({
      user: {
        username: user.username,
        email: user.email,
      },
      resume,
    });
  } catch (err) {
    console.error("❌ Get public resume failed:", err);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

// ---------------- Update Resume Slug (for all) ----------------
export const updateResumeSlug = async (req, res) => {
  try {
    const { slug } = req.body;
    if (!slug?.trim())
      return res.status(400).json({ error: "Slug is required" });

    const cleanSlug = slug.trim();

    // Update slug across all resumes of the user
    await Resume.updateMany(
      { user: req.user.id },
      { $set: { slug: cleanSlug } }
    );

    res.json({
      success: true,
      message: "Slug updated for all resumes",
      slug: cleanSlug,
    });
  } catch (err) {
    console.error("❌ Update slug failed:", err);
    res.status(500).json({ error: "Failed to update slug" });
  }
};

// ---------------- Check if slug is valid for user ----------------

// ✅ Check if username + slug combo exists
export const checkResumeSlug = async (req, res) => {
  const { username, slug } = req.params;

  try {
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.json({ exists: false });
    }

    const resume = await Resume.findOne({
      user: user._id,
      slug,
    }).lean();

    if (!resume) {
      return res.json({ exists: false });
    }

    res.json({ exists: true });
  } catch (err) {
    console.error("❌ Check resume slug failed:", err);
    res.status(500).json({ exists: false, error: "Internal Server Error" });
  }
};
