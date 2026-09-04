import express, { Router } from "express";
import {
  createDepartment,
  getAlldepartment,
} from "../controllers/departmentController.js";
import protect from "../middlewares/protect.js";
import restrictTo from "../middlewares/restrictTo.js";
import { validate } from "../middlewares/validate.js";
import { createDepartmentSchema } from "../validation/departmentValidation.js";
const router = express.Router();
router.use(protect);
router.post(
  "/",
  validate(createDepartmentSchema),
  restrictTo("admin"),
  createDepartment,
);
router.get("/", restrictTo("admin"), getAlldepartment);
export default router;
