import {
  createEmployee,
  getAllEmployees,
  getOneEmployee,
  deleteEmployee,
  updateEmployee,
} from "../controllers/employeeController.js";
import restrictTo from "../middlewares/restrictTo.js";
import protect from "../middlewares/protect.js";
import express from "express";
import { validate, validateIdParams } from "../middlewares/validate.js";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validation/employeevalidation.js";
const router = express.Router();
router.use(protect);
router.get(
  "/:id",
  validateIdParams,
  restrictTo("admin", "hr", "manager"),
  getOneEmployee,
);
router.use(restrictTo("admin", "hr"));
router.get("/", getAllEmployees);
router.post("/", validate(createEmployeeSchema), createEmployee);
router.patch(
  "/:id",
  validateIdParams,
  validate(updateEmployeeSchema),
  updateEmployee,
);
router.delete("/:id", validateIdParams, deleteEmployee);
export default router;
