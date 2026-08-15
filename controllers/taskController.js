import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Department from "../models/departmentModel.js";
import Task from "../models/taskModel.js";
import AggregateFeatures from "../utils/aggregateFeatures.js";

export const createTask = catchAsync(async (req, res, next) => {
  const { title, description, deadline, assignedTo } = req.body;
  const department = await Department.findOne({ manager: req.user.id });
  if (!department) return next(new AppError("department not found", 404));
  const employee = await Employee.findOne({ user: assignedTo });
  if (!employee) return next(new AppError("employee not found", 404));
  if (department.id !== employee.department.toString())
    return next(
      new AppError(
        "can not assign a task to employee who is not in your department",
        403,
      ),
    );

  const task = await Task.create({
    assignedBy: req.user.id,
    assignedTo: employee.user,
    department: department.id,
    title,
    deadline,
    description,
  });

  res.status(200).json({
    status: "success",
    message: "task created successfuly",
    data: {
      task,
    },
  });
});

export const getAllTasks = catchAsync(async (req, res, next) => {
  const pipline = [
    {
      $lockup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "employee",
      },
      $unwind: "$employee",
      $lockup: {
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "manager",
      },
      $unwind: "$manager",
      lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department",
      },
      $unwind: "$department",

      $project: {
        title: 1,
        status: 1,
        deadline: 1,
        "employee.firstName": 1,
        "employee.lastName": 1,
        "employee.email": 1,
        "manager.firstName": 1,
        "manager.lastName": 1,
        "manager.email": 1,
        "department.name": 1,
      },
    },
  ];
  if (req.user.rule === "manager") {
    pipline.unshift({
      $match: {
        assigendBy: new mongoose.Types.ObjectId(req.user.id),
      },
    });
  }
  const features = new AggregateFeatures(pipline, req.query);

  features
    .filter(["status", "department.name"])
    .search(["employee.firstName", "employee.lastName", "title"])
    .sort()
    .limitFields()
    .paginate();
  const tasks = await Task.aggregate(features.pipeline);
  res.status(200).json({
    status: "success",
    data: {
      tasks,
    },
  });
});
