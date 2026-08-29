import express from "express";
import {
  getAllAttendance,
  markAttendance,
  updateAttendance,
  getMyAttendance,
} from "../controllers/attendanceController.js";
import restrictTo from "../middlewares/restrictTo.js";
import protect from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import {
  attendanceSchema,
  updateAttendanceSchema,
} from "../validation/attendanceValidation.js";
const router = express.Router();
router.use(protect);
router.get("/", restrictTo("admin", "hr"), getAllAttendance);
router.post(
  "/",
  restrictTo("security"),
  validate(attendanceSchema),
  markAttendance,
);
router.patch(
  "/:id",
  restrictTo("security"),
  validate(updateAttendanceSchema),
  updateAttendance,
);
router.get("/my-attendance", getMyAttendance);
export default router;
