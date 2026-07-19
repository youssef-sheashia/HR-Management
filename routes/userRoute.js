import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  forgetPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";
import protect from "../middlewares/protect.js";
import { validate } from "../middlewares/validate.js";
import {
  loginSchema,
  verifyOTPSchema,
  resetPasswordshema,
} from "../validation/authValidation.js";
const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", validate(verifyOTPSchema), verifyOTP);
router.post("/reset-password", validate(resetPasswordshema), resetPassword);

export default router;
