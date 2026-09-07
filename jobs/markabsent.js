import cron from "node-cron";
import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModel.js";
import Permission from "../models/permissionModel.js";

export const markAbsentees = async () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    console.log("Weekend — skipping absence job");
    return;
  }

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const employees = await Employee.find({ status: "active" }).select("user");

  const alreadyMarked = await Attendance.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  }).select("employee");
  const markedIds = new Set(alreadyMarked.map((a) => a.employee.toString()));

  const unmarked = employees.filter((e) => !markedIds.has(e.user.toString()));

  const recordsToInsert = [];

  for (const emp of unmarked) {
    const approvedLeave = await Permission.findOne({
      employeeID: emp.user,
      status: "hr_approved",
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    recordsToInsert.push({
      employee: emp.user,
      date: startOfDay,
      status: approvedLeave ? "on_leave" : "absent",
    });
  }

  if (recordsToInsert.length > 0) {
    await Attendance.insertMany(recordsToInsert);
    console.log(`✅ auto-marked ${recordsToInsert.length} attendance records`);
  }
};

cron.schedule("5 12 * * 0-4", markAbsentees);
