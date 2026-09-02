import Attendance from "../models/attendanceModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import User from "../models/userModel.js";
import Permission from "../models/permissionModel.js";
export const getEmployeesForAttendance = catchAsync(async (req, res, next) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const employeesHavePermission = await Permission.find({
    status: "approved",
    startDate: { $lte: endOfDay },
    endDate: { $gte: startOfDay },
  }).select("employee");

  const employeesWithPermission = employeesHavePermission.map((permission) =>
    permission.employee.toString(),
  );

  const employees = await User.find({
    role: "employee",
    active: true,
    _id: { $nin: employeesWithPermission },
  });

  res.status(200).json({
    status: "success",
    results: employees.length,
    data: {
      employees,
    },
  });
});
export const markAttendance = catchAsync(async (req, res, next) => {
  const { employeeID, checkIn } = req.body;

  const employee = await User.findById(employeeID);

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  const parsedDate = new Date();

  if (parsedDate.toDateString() !== new Date().toDateString()) {
    return next(new AppError("You can only mark attendance for today", 400));
  }

  const startOfDay = new Date(parsedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(parsedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAttendance = await Attendance.findOne({
    employee: employeeID,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (existingAttendance) {
    return next(
      new AppError("Attendance for this employee already exists", 400),
    );
  }

  const parsedCheckIn = new Date(checkIn);

  const limitTime = new Date(parsedCheckIn);
  limitTime.setHours(9, 15, 0, 0);

  const status = parsedCheckIn > limitTime ? "late" : "present";

  const attendance = await Attendance.create({
    employee: employeeID,
    date: startOfDay,
    status,
    checkIn: parsedCheckIn,
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
export const updateAttendance = catchAsync(async (req, res, next) => {
  const attendanceID = req.params.id;
  const attendance = await Attendance.findById(attendanceID);
  if (!attendance) return next(new AppError("attendance not found", 404));
  if (attendance.date.toDateString() !== new Date().toDateString())
    return next(new AppError("You can only update attendance for today", 400));
  const { checkIn, checkOut } = req.body;
  const parsedCheckIn = checkIn ? new Date(checkIn) : attendance.checkIn;
  const parsedCheckOut = checkOut ? new Date(checkOut) : attendance.checkOut;
  const limitTime = new Date(parsedCheckIn);
  limitTime.setHours(9, 15, 0, 0);
  const status = parsedCheckIn > limitTime ? "late" : "present";
  attendance.checkIn = parsedCheckIn;
  attendance.checkOut = parsedCheckOut;
  attendance.status = status;
  await attendance.save();
  res.status(200).json({
    status: "success",
    data: {
      attendance,
    },
  });
});
export const getMyAttendance = catchAsync(async (req, res, next) => {
  const employeeID = req.user.id;
  const features = new APIFeatures(
    Attendance.find({ employee: employeeID }),
    req.query,
  )
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
