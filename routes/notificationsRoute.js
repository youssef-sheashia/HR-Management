import {
  markNotificationAsRead,
  getNotifications,
  getUnreadNotificationsCount,
} from "../controllers/notificationController.js";
import express from "express";
import protect from "../middlewares/protect.js";
import restrictTo from "../middlewares/restrictTo.js";
const router = express.Router();
router.use(protect, restrictTo("employee", "manager", "admin"));
router.get("/", getNotifications);
router.patch("/mark-as-read", markNotificationAsRead);
router.get("/unread-count", getUnreadNotificationsCount);
export default router;
