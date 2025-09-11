import express from "express";
import {
  uploadResume,
  setActiveResume,
  getUserResumes,
  deleteResume,
  downloadResume,
  updateResumeSlug,
} from "../controller/resume-controller.js";
import { authMiddleware } from "../controller/auth-controller.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/upload", upload.single("file"), uploadResume);
router.get("/", getUserResumes);
router.put("/active/:resumeId", setActiveResume);
router.delete("/:resumeId", deleteResume);
router.get("/download/:resumeId", downloadResume);
router.put("/slug", updateResumeSlug);

export default router;
