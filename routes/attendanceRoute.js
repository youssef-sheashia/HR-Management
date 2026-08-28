import express from "express";
import {
  getAllAttendance,
  markAttendance,
} from "../controllers/attendanceController.js";
import restrictTo from "../middlewares/restrictTo.js";
import protect from "../middlewares/protect.js";
const router = express.Router();
router.use(protect);
router.get("/", getAllAttendance);
router.post("/", restrictTo("security"), markAttendance);
export default router;
