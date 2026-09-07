import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import AggregateFeatures from "../utils/aggregateFeatures.js";
import Department from "../models/departmentModel.js";

export const createEmployee = catchAsync(async (req, res, next) => {
  const { department } = req.body;
  const departmentexists = await Department.findById(department);
  if (!departmentexists) {
    return next(new AppError("Department not found", 404));
  }
  const { firstName, lastName, email, role, password, ...others } = req.body;
  if (req.user.role === "hr" && role === "admin") {
    return next(
      new AppError("You are not authorized to create an admin employee", 403),
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.create(
      [
        {
          firstName,
          lastName,
          email,
          role,
          password,
        },
      ],
      { session },
    );
    const employee = await Employee.create(
      [
        {
          user: user[0]._id,
          ...others,
        },
      ],
      { session },
    );
    await session.commitTransaction();
    res.status(201).json({
      status: "success",
      message: "employee created successfuly",
    });
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    await session.endSession();
  }
});
export const getOneEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findOne({ user: req.params.id })
    .populate({
      path: "user",
      match: { active: true },
      select: "firstName lastName role profileImg",
    })
    .populate({
      path: "department",
      match: req.user.role === "manager" ? { manager: req.user.id } : {},
    });
  if (!employee || !employee.user || !employee.department) {
    return next(new AppError("Employee not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { employee },
  });
});
export const getAllEmployees = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: "$department",
    },
    {
      $match: {
        "user.active": true,
      },
    },
  ];

  if (req.user.role === "manager") {
    pipeline.push({
      $match: {
        "department.manager": new mongoose.Types.ObjectId(req.user.id),
      },
    });
  }

  const features = new AggregateFeatures(pipeline, req.query)
    .filter({
      status: "status",
      contractType: "contractType",
      salaryGrade: "salaryGrade",
      department: "department.name",
      firstName: "user.firstName",
      lastName: "user.lastName",
      jobTitle: "jobTitle",
    })
    .sort()
    .paginate();

  features.pipeline.push({
    $project: {
      "user.password": 0,
      "user.refreshToken": 0,
      "user.passwordResetToken": 0,
      "user.ResetTokenExpiration": 0,
      "user.changedPasswordAt": 0,
      "user.lastLoginAt": 0,
    },
  });

  const employees = await Employee.aggregate(features.pipeline);
  res.status(200).json({
    status: "success",
    results: employees.length,
    data: { employees },
  });
});
export const updateEmployee = catchAsync(async (req, res, next) => {
  const { firstName, lastName, profileImg, role, ...employeeData } = req.body;

  const updateUser = {};

  if (firstName) updateUser.firstName = firstName;
  if (lastName) updateUser.lastName = lastName;
  if (profileImg) updateUser.profileImg = profileImg;
  if (role) updateUser.role = role;

  if (req.user.role === "hr" && role === "admin") {
    return next(
      new AppError("You are not authorized to create an admin employee", 403),
    );
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await User.findByIdAndUpdate(req.params.id, updateUser, {
      new: true,
      runValidators: true,
      session,
    });

    await Employee.findOneAndUpdate({ user: req.params.id }, employeeData, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();

    res.status(200).json({
      status: "success",
      message: "Employee updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
});
export const deleteEmployee = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { session },
    );
    const employee = await Employee.findOneAndUpdate(
      { user: req.params.id },
      { status: "terminated" },
      { session },
    );
    if (!user || !employee) {
      throw new AppError("Employee not found", 404);
    }
    await session.commitTransaction();
    res.status(200).json({
      status: "success",
      message: "user now is not active",
    });
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    await session.endSession();
  }
});
