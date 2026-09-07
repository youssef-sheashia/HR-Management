import Department from "../models/departmentModel.js";
import employee from "../models/employeeModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
export const createDepartment = catchAsync(async (req, res, next) => {
  const manager = await employee.findOne({ user: req.body.manager });
  if (!manager) return next(new AppError("manager not found", 404));
  if (manager.status !== "active")
    return next(new AppError("manager is not active", 400));
  const existingDepartment = await Department.findOne({ name: req.body.name });
  if (existingDepartment) {
    return next(new AppError("Department with this name already exists", 400));
  }
  const department = await Department.create(req.body);

  res.status(200).json({
    status: "success",
    message: "department created successfuly",
    data: {
      department,
    },
  });
});

export const getAlldepartment = catchAsync(async (req, res, next) => {
  const department = await Department.find();
  if (!department) return next(new AppError("no department found ", 404));
  res.status(200).json({
    status: "success",
    data: {
      department,
    },
  });
});
