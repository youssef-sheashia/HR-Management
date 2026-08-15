import express from "express";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
} from "../controllers/taskController.js";
import protect from "../middlewares/protect.js";
import restrictTo from "../middlewares/restrictTo.js";
const router = express.Router();
router.use(protect);
router.get("/", restrictTo("admin", "manager"), getAllTasks);
router.post("/", restrictTo("manager"), createTask);
router.get("/my", restrictTo("employee"));
router.patch("/:id/status", restrictTo("employee"), updateTaskStatus);
export default router;
