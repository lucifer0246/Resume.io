import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkUserExists,
  authMiddleware,
  changePassword,
} from "../controller/auth-controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});
router.get("/check-user", checkUserExists);
router.put("/change-password", authMiddleware, changePassword);

export default router;
