import express from "express";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  addComment,
} from "../controllers/taskController.js";
import protect from "../middlewares/protect.js";
import restrictTo from "../middlewares/restrictTo.js";
import { validate, validateIdParams } from "../middlewares/validate.js";
import { createTaskSchema } from "../validation/taskValidation.js";
const router = express.Router();
router.use(protect);
router.get("/", restrictTo("admin", "manager"), getAllTasks);
router.post("/", restrictTo("manager"), validate(createTaskSchema), createTask);
router.get("/my", restrictTo("employee"), getMyTasks);
router.patch(
  "/:id/status",
  restrictTo("employee"),
  validateIdParams,
  updateTaskStatus,
);
router.patch(
  "/:id/comments",
  restrictTo("employee", "manager"),
  validateIdParams,
  addComment,
);
export default router;
