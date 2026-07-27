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
import { validate } from "../middlewares/validate.js";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validation/employeevalidation.js";
const router = express.Router();
router.use(protect);
router.get("/:id", restrictTo("admin", "hr", "manager"), getOneEmployee);
router.use(restrictTo("admin", "hr"));
router.get("/", getAllEmployees);
router.post("/", validate(createEmployeeSchema), createEmployee);
router.patch("/:id", validate(updateEmployeeSchema), updateEmployee);
router.delete("/:id", deleteEmployee);
export default router;
