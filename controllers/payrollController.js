import PDFDocument from "pdfkit";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import Payroll from "../models/payrollModel.js";
import AppError from "../utils/appError.js";
import aggregateFeaturs from "../utils/aggregateFeatures.js";
import APIFeatures from "../utils/apiFeatures.js";
import Employee from "../models/employeeModel.js";
import Notification from "../models/notificationModel.js";
import Attendance from "../models/attendanceModel.js";

export const createPayrollForAllEmployees = catchAsync(
  async (req, res, next) => {
    const { month, year } = req.body;

    const existingPayroll = await Payroll.findOne({ month, year });
    if (existingPayroll) {
      return next(
        new AppError("Payroll for this month and year already exists", 400),
      );
    }

    const employees = await Employee.find({ status: "active" });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    for (const emp of employees) {
      const absentDays = await Attendance.countDocuments({
        employee: emp.user,
        status: "absent",
        date: { $gte: startDate, $lt: endDate },
      });

      const lateDays = await Attendance.countDocuments({
        employee: emp.user,
        status: "late",
        date: { $gte: startDate, $lt: endDate },
      });

      const absenceDeduction = (absentDays * emp.baseSalary) / 30;
      const lateDeduction = ((lateDays * emp.baseSalary) / 30) * 0.5;
      const totalDeductions = absenceDeduction + lateDeduction;

      const allowances = {
        transport: emp.allowances?.transport || 0,
        housing: emp.allowances?.housing || 0,
        medical: emp.allowances?.medical || 0,
      };

      const totalAllowances =
        allowances.transport + allowances.housing + allowances.medical;

      const netSalary = emp.baseSalary + totalAllowances - totalDeductions;

      await Payroll.create({
        employee: emp.user,
        month,
        year,
        baseSalary: emp.baseSalary,
        allowances,
        deductions: {
          absence: absenceDeduction,
          late: lateDeduction,
        },
        netSalary,
        status: "draft",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Payroll created successfully",
    });
  },
);
export const getMyPayslip = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Payroll.find({ employee: req.user.id }),
    req.query,
  )
    .filter(["month", "year"])
    .sort()
    .limitFields()
    .paginate();
  const myPayslips = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      myPayslips,
    },
  });
});
export const getAllPayRecords = catchAsync(async (req, res, next) => {
  const pipline = [
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "user",
        as: "employee",
      },
    },

    {
      $unwind: "$employee",
    },

    {
      $lookup: {
        from: "users",
        localField: "employee.user",
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
        localField: "employee.department",
        foreignField: "_id",
        as: "department",
      },
    },

    {
      $unwind: "$department",
    },
  ];
  const features = new aggregateFeaturs(pipline, req.query)
    .filter({
      month: "month",
      year: "year",
      department: "department.name",
    })
    .sort()
    .paginate();

  const payrollRecords = await Payroll.aggregate(features.pipeline);

  res.status(200).json({
    status: "success",
    length: payrollRecords.length,
    data: {
      payrolls: payrollRecords,
    },
  });
});

export const downloadPayslip = catchAsync(async (req, res, next) => {
  const payroll = await Payroll.findById(req.params.id).populate({
    path: "employee",
    select: "firstName lastName email",
  });

  if (!payroll) {
    return next(new AppError("Payroll not found", 404));
  }

  if (
    req.user.role === "employee" &&
    payroll.employee._id.toString() !== req.user.id.toString()
  ) {
    return next(
      new AppError("You are not allowed to access this payslip", 403),
    );
  }

  // department isn't reachable from a User, so look it up via Employee
  const employeeProfile = await Employee.findOne({
    user: payroll.employee._id,
  }).populate({ path: "department", select: "name" });

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="payslip-${payroll.month}-${payroll.year}.pdf"`,
  );

  doc.pipe(res);

  doc.fontSize(20).text("PAYSLIP", { align: "center" });
  doc.moveDown();
  doc.fontSize(12);

  doc.text(
    `Employee: ${payroll.employee.firstName} ${payroll.employee.lastName}`,
  );
  doc.text(`Email: ${payroll.employee.email}`);
  doc.text(`Department: ${employeeProfile?.department?.name || "N/A"}`);

  doc.moveDown();
  doc.text(`Month: ${payroll.month}`);
  doc.text(`Year: ${payroll.year}`);

  doc.moveDown();
  doc.fontSize(14).text("Salary Details");
  doc.moveDown();
  doc.fontSize(12);

  doc.text(`Base Salary: ${payroll.baseSalary}`);
  doc.text(`Transport Allowance: ${payroll.allowances?.transport || 0}`);
  doc.text(`Housing Allowance: ${payroll.allowances?.housing || 0}`);
  doc.text(`Medical Allowance: ${payroll.allowances?.medical || 0}`);

  doc.moveDown();
  doc.text(`Absence Deduction: ${payroll.deductions?.absence || 0}`);
  doc.text(`Late Deduction: ${payroll.deductions?.late || 0}`);

  doc.moveDown();
  doc.fontSize(16).text(`Net Salary: ${payroll.netSalary}`);

  doc.moveDown();
  doc.fontSize(12).text(`Status: ${payroll.status}`);

  if (payroll.paidAt) {
    doc.text(`Paid At: ${payroll.paidAt.toDateString()}`);
  }

  doc.end();
});
export const getPayrollById = catchAsync(async (req, res, next) => {
  const payroll = await Payroll.findById(req.params.id).populate({
    path: "employee",
    select: "firstName lastName email",
  });

  if (!payroll) {
    return next(new AppError("Payroll not found", 404));
  }

  const employeeProfile = await Employee.findOne({
    user: payroll.employee._id,
  }).populate({ path: "department", select: "name" });

  res.status(200).json({
    status: "success",
    data: {
      payroll,
      department: employeeProfile?.department || null,
    },
  });
});
export const markPayrollAsPaid = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: "employee",
        select: "firstName lastName email",
      })
      .session(session);

    if (!payroll) {
      await session.abortTransaction();
      return next(new AppError("Payroll not found", 404));
    }
    if (payroll.status === "paid") {
      await session.abortTransaction();
      return next(new AppError("Payroll is already marked as paid", 400));
    }

    payroll.status = "paid";
    payroll.paidAt = new Date();

    await payroll.save({ session });

    const notification = await Notification.create(
      [
        {
          recipient: payroll.employee.id,
          type: "payslip_ready",
          message: `Your payroll for ${payroll.month}/${payroll.year} has been paid.`,
          relatedId: payroll._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    try {
      req.app
        .get("io")
        .to(payroll.employee.toString())
        .emit("notification", notification[0]);
    } catch (err) {
      console.error("socket emit failed:", err);
    }

    res.status(200).json({
      status: "success",
      message: "Payroll marked as paid successfully",
      data: {
        payroll,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    await session.endSession();
  }
});

export const updatePayroll = catchAsync(async (req, res, next) => {
  const payroll = await Payroll.findOne({
    _id: req.params.id,
    status: { $ne: "paid" },
  });

  if (!payroll) {
    return next(new AppError("Payroll not found", 404));
  }

  if (req.body.baseSalary !== undefined) {
    payroll.baseSalary = req.body.baseSalary;
  }

  if (req.body.allowances) {
    payroll.allowances = {
      ...payroll.allowances.toObject(),
      ...req.body.allowances,
    };
  }

  if (req.body.deductions) {
    payroll.deductions = {
      ...payroll.deductions.toObject(),
      ...req.body.deductions,
    };
  }

  payroll.deductions.total =
    payroll.deductions.absence + payroll.deductions.late;

  const totalAllowances =
    payroll.allowances.transport +
    payroll.allowances.housing +
    payroll.allowances.medical;

  payroll.netSalary =
    payroll.baseSalary + totalAllowances - payroll.deductions.total;

  await payroll.save();

  res.status(200).json({
    status: "success",
    message: "Payroll updated successfully",
    data: {
      payroll,
    },
  });
});
