import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
import Department from "../models/departmentModel.js";
import Task from "../models/taskModel.js";
import Employee from "../models/employeeModel.js";
import AggregateFeatures from "../utils/aggregateFeatures.js";
import APIFeatures from "../utils/apiFeatures.js";
import Notification from "../models/notificationModel.js";
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

  const session = await mongoose.startSession();
  let task, notification;

  try {
    session.startTransaction();

    const taskDocs = await Task.create(
      [
        {
          assignedBy: req.user.id,
          assignedTo: employee.id,
          department: department.id,
          title,
          description,
          deadline,
        },
      ],
      { session },
    );
    task = taskDocs[0];

    const notificationDocs = await Notification.create(
      [
        {
          recipient: employee.user,
          type: "task_assigned",
          message: `You have been assigned a new task: "${title}"`,
          relatedId: task._id,
        },
      ],
      { session },
    );
    notification = notificationDocs[0];

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    await session.endSession();
  }

  try {
    req.app
      .get("io")
      .to(employee.user.toString())
      .emit("notification", notification);
  } catch (err) {
    console.error("socket emit failed:", err);
  }
  it("notification", notification);

  res.status(201).json({
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
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "manager",
      },
    },
    {
      $unwind: "$manager",
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
  if (req.user.role === "manager") {
    pipline.unshift({
      $match: {
        assignedBy: new mongoose.Types.ObjectId(req.user.id),
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
export const getMyTasks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Task.find({ assignedTo: req.user.id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tasks = await features.query;
  res.status(200).json({
    status: "success",
    length: tasks.length,
    data: {
      tasks,
    },
  });
});
export const updateTaskStatus = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) return next(new AppError("task not found", 404));
  if (task.assignedTo._id.toString() !== req.user.id)
    return next(new AppError("you are not the owner of this task", 403));
  if (task.status === "completed")
    return next(new AppError("task has completed", 403));
  task.status = req.body.status;
  await task.save();
  res.status(200).json({
    status: "success",
    message: "task status changed",
    data: {
      task,
    },
  });
});
export const addComment = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("task not found", 404));
  if (task.assignedTo._id.toString() !== req.user.id)
    return next(new AppError("you are not the owner of this task", 403));
  task.comments.push({
    authorId: req.user.id,
    text: req.body.text,
  });
  await task.save();
  res.status(200).json({
    status: "success",
    message: "comment added",
    data: {
      task,
    },
  });
});
