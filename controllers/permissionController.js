import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import Permission from "../models/permissionModel.js";

export const createPermission = catchAsync(async (req, res, next) => {
  const { type, reason, attachment, startDate, endDate } = req.body;

  if (startDate > endDate) {
    return next(new AppError("Start date must be before end date", 400));
  }

  const diffTime = endDate - startDate;
  const newDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const existingPermission = await Permission.findOne({
    employeeID: req.user.id,
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });

  if (existingPermission) {
    return next(
      new AppError(
        "You already have a permission request for the selected dates.",
        400,
      ),
    );
  }

  if (type === "annual") {
    const currentYear = new Date().getFullYear();

    const annualPermissions = await Permission.find({
      employeeID: req.user.id,
      type: "annual",
      startDate: {
        $gte: new Date(currentYear, 0, 1),
      },
      endDate: {
        $lte: new Date(currentYear, 11, 31, 23, 59, 59, 999),
      },
    });
    const usedDays = annualPermissions.reduce((total, permission) => {
      const permissionStart = new Date(permission.startDate);
      const permissionEnd = new Date(permission.endDate);

      const diffTime = permissionEnd - permissionStart;

      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      return total + days;
    }, 0);

    if (usedDays + newDays > 21) {
      return next(
        new AppError(
          `You have exceeded the maximum limit of 21 annual permission days. You have ${21 - usedDays} days remaining.`,
          400,
        ),
      );
    }
  }

  if (type === "emergency") {
    const currentYear = new Date().getFullYear();

    const emergencyPermissions = await Permission.find({
      employeeID: req.user.id,
      type: "emergency",
      startDate: {
        $gte: new Date(currentYear, 0, 1),
      },
      endDate: {
        $lte: new Date(currentYear, 11, 31, 23, 59, 59, 999),
      },
    });

    const usedDays = emergencyPermissions.reduce((total, permission) => {
      const permissionStart = new Date(permission.startDate);

      const permissionEnd = new Date(permission.endDate);

      const diffTime = permissionEnd - permissionStart;

      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      return total + days;
    }, 0);

    if (usedDays + newDays > 3) {
      return next(
        new AppError(
          `You have exceeded the maximum limit of 3 emergency permission days. You have ${3 - usedDays} days remaining.`,
          400,
        ),
      );
    }
  }

  if (type === "sick" && !attachment) {
    return next(
      new AppError("Attachment is required for sick leave requests.", 400),
    );
  }

  const permission = await Permission.create({
    employeeID: req.user.id,
    type,
    reason,
    attachment,
    startDate,
    endDate,
  });

  res.status(201).json({
    status: "success",
    data: {
      permission,
    },
  });
});
