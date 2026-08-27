import Attendance from "../models/attendanceModel";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures";
import User from "../models/userModel";
export const markAttendance = catchAsync(async (req, res, next) => {
  const { employeeID, date } = req.body;
  const employee = await User.findById(employeeID);
  if (!employee) return next(new AppError("employee not found", 404));
  if (date.toDateString() !== new Date().toDateString()) {
    return next(new AppError("You can only mark attendance for today", 400));
  }
  const existingAttendance = await Attendance.findOne({
    employee: employeeID,
    date: new Date(),
  });
  if (existingAttendance) {
    return next(
      new AppError("Attendance for this employee already exists", 400),
    );
  }
  const checkIn = new Date(req.body.checkIn);

  const limitTime = new Date(checkIn);
  limitTime.setHours(9, 15, 0, 0);

  let status = checkIn > limitTime ? "late" : "present";
  const attendance = await Attendance.create({
    employee: employeeID,
    date,
    status,
    checkIn,
    markedBy: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      attendance,
    },
  });
});
export const getAllAttendance = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Attendance.find(), req.query)
    .sort()
    .limitFields()
    .paginate();
  const attendance = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});
