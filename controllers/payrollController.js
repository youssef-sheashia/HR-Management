import catchAsync from "../utils/catchAsync.js";
import Payroll from "../models/payrollModel.js";
import AppError from "../utils/appError.js";
import aggregateFeaturs from "../utils/aggregateFeatures.js";
import Employee from "../models/employeeModel.js";
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
  const myPayslips = await Payroll.find({ employeeId: req.user.id });
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
