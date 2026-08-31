import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import Permission from "../models/permissionModel.js";
import Employee from "../models/employeeModel.js";
import AggregateFeatures from "../utils/aggregateFeatures.js";

export const createPermission = catchAsync(async (req, res, next) => {
  const { type, reason, attachment, startDate, endDate } = req.body;

  if (startDate > endDate) {
    return next(new AppError("Start date must be before end date", 400));
  }

  const diffTime = endDate - startDate;
  const newDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const existingPermission = await Permission.findOne({
    employeeID: req.user.id,
    status: { $ne: "rejected" },
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
      status: {
        $in: ["hr_approved", "pending", "manager_approved"],
      },
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
export const getAllPermissions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Permission.find(), req.query)
    .filter(["employeeID", "type", "status"])
    .sort()
    .limitFields()
    .paginate();
  const permissions = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      permissions,
    },
  });
});

export const getMYPermissions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Permission.find({ employeeID: req.user.id }),
    req.query,
  )
    .filter(["type", "status"])
    .sort()
    .limitFields()
    .paginate();
  const permissions = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      permissions,
    },
  });
});
export const getpermissionsByManager = catchAsync(async (req, res, next) => {
  const features = new AggregateFeatures(
    Permission.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeID",
          foreignField: "user",
          as: "employee",
        },
      },
      { $unwind: "$employee" },

      {
        $lookup: {
          from: "departments",
          localField: "employee.department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $match: {
          "department.manager": req.user.id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "employeeID",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          employeeID: 1,
          type: 1,
          reason: 1,
          attachment: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.email": 1,
          "department.name": 1,
        },
      },
    ]),
    req.query,
  )
    .filter()
    .sort()
    .paginate();
  const permissions = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      permissions,
    },
  });
});
export const permissionActionByManager = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (
    req.body.action !== "manager_approved" &&
    req.body.action !== "rejected"
  ) {
    return next(
      new AppError(
        "Invalid action. Action must be either 'manager_approved' or 'rejected'.",
        400,
      ),
    );
  }
  const permission = await Permission.findById(id);
  if (!permission) {
    return next(new AppError("Permission not found", 404));
  }

  const employee = await Employee.findOne({
    user: permission.employeeID,
  }).populate("department");

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  if (employee.department.manager.toString() !== req.user.id) {
    return next(new AppError("You are not the manager of this employee", 403));
  }
  if (permission.status !== "pending") {
    return next(new AppError("Permission is not pending", 400));
  }
  permission.status = req.body.action;
  await permission.save();
  res.status(200).json({
    status: "success",
    data: {
      permission,
    },
  });
});
export const permissionActionByHR = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.action !== "hr_approved" && req.body.action !== "rejected") {
    return next(
      new AppError(
        "Invalid action. Action must be either 'hr_approved' or 'rejected'.",
        400,
      ),
    );
  }
  const permission = await Permission.findById(id);
  if (!permission) {
    return next(new AppError("Permission not found", 404));
  }
  if (permission.status !== "manager_approved") {
    return next(new AppError("Permission is not approved by manager", 400));
  }
  permission.status = req.body.action;
  await permission.save();
  res.status(200).json({
    status: "success",
    data: {
      permission,
    },
  });
});
export const deletePermission = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const permission = await Permission.findOneAndDelete({
    _id: id,
    employeeID: rq.user.id,
    status: "pending",
  });
  if (!permission) {
    return next(new AppError("Permission not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      permission,
    },
  });
});
