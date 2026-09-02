import {
  createPayrollForAllEmployees,
  getMyPayslip,
  getAllPayRecords,
  downloadPayslip,
} from "../controllers/payrollController.js";
import express from "express";
import protect from "../middlewares/protect.js";
import restrictTo from "../middlewares/restrictTo.js";

const router = express.Router();

router.use(protect);
router.get("/", restrictTo("hr", "admin"), getAllPayRecords);
router.get("/my", getMyPayslip);
router.post("/", restrictTo("hr", "admin"), createPayrollForAllEmployees);
router.get(
  "/:id/download",
  restrictTo("hr", "admin", "employee"),
  downloadPayslip,
);
export default router;
