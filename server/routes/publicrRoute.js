import express from "express";
import {
  checkResumeSlug,
  getPublicResume,
} from "../controller/resume-controller.js";

const router = express.Router();

// GET /public/:username
router.get("/:username", getPublicResume);

router.get("/check/:username/:slug", checkResumeSlug);
export default router;
