import express from "express";
import {
  getAllAttendance,
  markAttendance,
  updateAttendance,
  getMyAttendance,
  getEmployeesForAttendance,
} from "../controllers/attendanceController.js";
import restrictTo from "../middlewares/restrictTo.js";
import protect from "../middlewares/protect.js";
import {
  validate,
  validateIdParams,
  validateQuery,
} from "../middlewares/validate.js";
import {
  attendanceSchema,
  updateAttendanceSchema,
  attendanceQuerySchema,
} from "../validation/attendanceValidation.js";
const router = express.Router();
router.use(protect);
router.get(
  "/",
  restrictTo("admin", "hr"),
  validateQuery(attendanceQuerySchema),
  getAllAttendance,
);
router.get("/employee", restrictTo("security"), getEmployeesForAttendance);
router.post(
  "/",
  restrictTo("security"),
  validate(attendanceSchema),
  markAttendance,
);
router.patch(
  "/:id",
  restrictTo("security"),
  validateIdParams,
  validate(updateAttendanceSchema),
  updateAttendance,
);
router.get(
  "/my-attendance",
  validateQuery(attendanceQuerySchema),
  getMyAttendance,
);
export default router;
