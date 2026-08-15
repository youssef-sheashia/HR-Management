import express from "express";
import { createTask, getAllTasks } from "../controllers/taskController.js";
const router = express.Router();
router.route("/").get(getAllTasks).post(createTask);
export default router;
