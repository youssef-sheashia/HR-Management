import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  forgetPassword,
} from "../controllers/authController.js";
import protect from "../middlewares/protect.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validation/authValidation.js";
const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);
router.post("/forget-password", forgetPassword);

export default router;
