import PDFDocument from "pdfkit";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import Payroll from "../models/payrollModel.js";
import AppError from "../utils/appError.js";
import aggregateFeaturs from "../utils/aggregateFeatures.js";
import APIFeatures from "../utils/apiFeatures.js";
import Employee from "../models/employeeModel.js";
import Notification from "../models/notificationModel.js";

export const createPayrollForAllEmployees = catchAsync(
  async (req, res, next) => {
    const { month, year } = req.body;

    const existingPayroll = await Payroll.findOne({
      month,
      year,
    });

    if (existingPayroll) {
      return next(
        new AppError("Payroll for this month and year already exists", 400),
      );
    }

    const employees = await Employee.find({
      status: "active",
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    for (const emp of employees) {
      const absentDays = await Attendance.countDocuments({
        employee: emp._id,
        status: "absent",
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      const lateDays = await Attendance.countDocuments({
        employee: emp._id,
        status: "late",
        date: {
          $gte: startDate,
          $lt: endDate,
        },
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
        employee: emp._id,
        month,
        year,
        baseSalary: emp.baseSalary,

        allowances,

        deductions: {
          absence: absenceDeduction,
          late: lateDeduction,
          total: totalDeductions,
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
  const features = new aggregateFeaturs(
    payrolls.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
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
    ]),
    req.query,
  )
    .filter({
      month: "month",
      year: "year",
      department: "department.name",
    })
    .sort()
    .paginate();

  const payrollRecords = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      payrolls: payrollRecords,
    },
  });
});

export const downloadPayslip = catchAsync(async (req, res, next) => {
  const payroll = await Payroll.findById(req.params.id).populate({
    path: "employee",
    populate: [
      {
        path: "user",
        select: "firstName lastName email",
      },
      {
        path: "department",
        select: "name",
      },
    ],
  });

  if (!payroll) {
    return next(new AppError("Payroll not found", 404));
  }

  if (
    req.user.role === "employee" &&
    payroll.employee.user._id.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError("You are not allowed to access this payslip", 403),
    );
  }

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
    `Employee: ${payroll.employee.user.firstName} ${payroll.employee.user.lastName}`,
  );

  doc.text(`Email: ${payroll.employee.user.email}`);
  doc.text(`Department: ${payroll.employee.department.name}`);

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
    populate: [
      {
        path: "user",
        select: "firstName lastName email",
      },
      {
        path: "department",
        select: "name",
      },
    ],
  });

  if (!payroll) {
    return next(new AppError("Payroll not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      payroll,
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
        select: "user",
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
          recipient: payroll.employee.user,
          type: "payroll",
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
