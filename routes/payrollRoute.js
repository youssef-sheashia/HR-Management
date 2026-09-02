import express from "express";
import {
  createPayrollForAllEmployees,
  getMyPayslip,
  getAllPayRecords,
  downloadPayslip,
  getPayrollById,
  markPayrollAsPaid,
  updatePayroll,
} from "../controllers/payrollController.js";
import protect from "../middlewares/protect.js";

import restrictTo from "../middlewares/restrictTo.js";
import { validate, validateIdParams } from "../middlewares/validate.js";
import {
  payrollSchema,
  updatePayrollSchema,
} from "../validation/payrollValidation.js";
const router = express.Router();

router.use(protect);
router.get("/", restrictTo("hr", "admin"), getAllPayRecords);
router.post(
  "/",
  restrictTo("hr", "admin"),
  validate(payrollSchema),
  createPayrollForAllEmployees,
);
router.get(
  "/:id/download",
  restrictTo("hr", "admin", "employee"),
  validateIdParams,
  downloadPayslip,
);
router.get("/my", getMyPayslip);

router.use(restrictTo("hr", "admin"), validateIdParams);

router.get("/:id", getPayrollById);
router.patch("/:id", validate(updatePayrollSchema), updatePayroll);
router.patch("/:id/mark-paid", markPayrollAsPaid);
export default router;
