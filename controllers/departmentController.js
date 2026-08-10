import { date } from "zod";
import Department from "../models/departmentModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
export const createDepartment = catchAsync(async (req, res, next) => {
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
