import Notification from "../models/notificationModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    status: "success",
    data: {
      notifications,
    },
  });
});

export const getUnreadNotificationsCount = catchAsync(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user.id,
    read: false,
  });

  res.status(200).json({
    status: "success",
    data: {
      count,
    },
  });
});
export const markNotificationAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    {
      recipient: req.user.id,
      read: false,
    },
    {
      read: true,
    },
  );

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
});
