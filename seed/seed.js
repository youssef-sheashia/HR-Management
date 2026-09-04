import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import Employee from "../models/employeeModel.js";
import Department from "../models/departmentModel.js";
import Task from "../models/taskModel.js";
import Attendance from "../models/attendanceModel.js";
import Notification from "../models/notificationModel.js";
import Permission from "../models/permissionModel.js";
import Payroll from "../models/payrollModel.js";

dotenv.config({ path: "./config.env" });

const DB = process.env.LOCAL_DATABASE;

const PASSWORD = "Test@1234";

// ========================================
// Connect Database
// ========================================

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
};

// ========================================
// Clear Database
// ========================================

const clearDatabase = async () => {
  console.log("🗑️ Clearing old data...");

  await Notification.deleteMany({});
  await Permission.deleteMany({});
  await Payroll.deleteMany({});
  await Attendance.deleteMany({});
  await Task.deleteMany({});
  await Employee.deleteMany({});
  await Department.deleteMany({});
  await User.deleteMany({});

  console.log("✅ Old data deleted");
};

// ========================================
// Create Users
// ========================================

const createUsers = async () => {
  console.log("👤 Creating users...");

  // ========================================
  // Admin
  // ========================================

  const admin = await User.create({
    firstName: "Ahmed",
    lastName: "Admin",
    email: "admin@hrsystem.com",
    password: PASSWORD,
    role: "admin",
  });

  // ========================================
  // HR
  // ========================================

  const hrUsers = await User.create([
    {
      firstName: "Mona",
      lastName: "Hassan",
      email: "mona.hr@hrsystem.com",
      password: PASSWORD,
      role: "hr",
    },
    {
      firstName: "Omar",
      lastName: "Khaled",
      email: "omar.hr@hrsystem.com",
      password: PASSWORD,
      role: "hr",
    },
  ]);

  // ========================================
  // Managers
  // ========================================

  const managerUsers = await User.create([
    {
      firstName: "Mohamed",
      lastName: "Ali",
      email: "mohamed.manager@hrsystem.com",
      password: PASSWORD,
      role: "manager",
    },
    {
      firstName: "Sara",
      lastName: "Mahmoud",
      email: "sara.manager@hrsystem.com",
      password: PASSWORD,
      role: "manager",
    },
    {
      firstName: "Youssef",
      lastName: "Ahmed",
      email: "youssef.manager@hrsystem.com",
      password: PASSWORD,
      role: "manager",
    },
    {
      firstName: "Nour",
      lastName: "Ibrahim",
      email: "nour.manager@hrsystem.com",
      password: PASSWORD,
      role: "manager",
    },
  ]);

  // ========================================
  // Security
  // ========================================

  const securityUsers = await User.create([
    {
      firstName: "Hany",
      lastName: "Security",
      email: "hany.security@hrsystem.com",
      password: PASSWORD,
      role: "security",
    },
    {
      firstName: "Tamer",
      lastName: "Security",
      email: "tamer.security@hrsystem.com",
      password: PASSWORD,
      role: "security",
    },
    {
      firstName: "Mostafa",
      lastName: "Security",
      email: "mostafa.security@hrsystem.com",
      password: PASSWORD,
      role: "security",
    },
  ]);

  // ========================================
  // Employees
  // ========================================

  const employeeUsers = await User.create([
    {
      firstName: "Ali",
      lastName: "Hassan",
      email: "ali.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Omar",
      lastName: "Mohamed",
      email: "omar.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Mostafa",
      lastName: "Ahmed",
      email: "mostafa.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Mahmoud",
      lastName: "Samir",
      email: "mahmoud.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Karim",
      lastName: "Hassan",
      email: "karim.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Amr",
      lastName: "Khaled",
      email: "amr.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Yassin",
      lastName: "Ali",
      email: "yassin.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Hassan",
      lastName: "Ibrahim",
      email: "hassan.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Khaled",
      lastName: "Mahmoud",
      email: "khaled.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Eslam",
      lastName: "Ahmed",
      email: "eslam.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Adham",
      lastName: "Mohamed",
      email: "adham.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Ayman",
      lastName: "Hassan",
      email: "ayman.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Maher",
      lastName: "Ali",
      email: "maher.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Seif",
      lastName: "Khaled",
      email: "seif.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Ziad",
      lastName: "Ahmed",
      email: "ziad.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Fady",
      lastName: "Mahmoud",
      email: "fady.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Bassem",
      lastName: "Ibrahim",
      email: "bassem.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Tarek",
      lastName: "Samir",
      email: "tarek.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Walid",
      lastName: "Hassan",
      email: "walid.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
    {
      firstName: "Ramy",
      lastName: "Mohamed",
      email: "ramy.employee@hrsystem.com",
      password: PASSWORD,
      role: "employee",
    },
  ]);

  console.log("✅ Users created");

  return {
    admin,
    hrUsers,
    managerUsers,
    securityUsers,
    employeeUsers,
  };
};

// ========================================
// Create Departments
// ========================================

const createDepartments = async (managerUsers) => {
  console.log("🏢 Creating departments...");

  const departments = await Department.create([
    {
      name: "IT",
      manager: managerUsers[0]._id,
    },
    {
      name: "Human Resources",
      manager: managerUsers[1]._id,
    },
    {
      name: "Finance",
      manager: managerUsers[2]._id,
    },
    {
      name: "Marketing",
      manager: managerUsers[3]._id,
    },
  ]);

  console.log("✅ Departments created");

  return departments;
};

// ========================================
// Create Employees
// ========================================

const createEmployees = async (
  admin,
  hrUsers,
  managerUsers,
  securityUsers,
  employeeUsers,
  departments,
) => {
  console.log("👨‍💻 Creating employee records...");

  // IMPORTANT:
  // Admin, HR, Managers and Security are also
  // represented in the Employee collection.

  const employeeRecords = [
    // ========================================
    // Admin
    // ========================================

    {
      user: admin,
      department: departments[0],
      jobTitle: "System Administrator",
    },

    // ========================================
    // HR
    // ========================================

    ...hrUsers.map((user) => ({
      user,
      department: departments[1],
      jobTitle: "HR Specialist",
    })),

    // ========================================
    // Managers
    // ========================================

    ...managerUsers.map((user, index) => ({
      user,
      department: departments[index % departments.length],
      jobTitle: "Department Manager",
    })),

    // ========================================
    // Security
    // ========================================

    ...securityUsers.map((user) => ({
      user,
      department: departments[0],
      jobTitle: "Security Officer",
    })),

    // ========================================
    // Normal Employees
    // ========================================

    ...employeeUsers.map((user, index) => ({
      user,
      department: departments[index % departments.length],
      jobTitle:
        index % 4 === 0
          ? "Backend Developer"
          : index % 4 === 1
            ? "Frontend Developer"
            : index % 4 === 2
              ? "Software Engineer"
              : "System Administrator",
    })),
  ];

  const employeesData = employeeRecords.map(
    ({ user, department, jobTitle }, index) => ({
      user: user._id,

      nationalId: `29${String(index + 1).padStart(12, "0")}`,

      department: department._id,

      jobTitle,

      contractType:
        index % 3 === 0
          ? "full-time"
          : index % 3 === 1
            ? "part-time"
            : "contract",

      hireDate: new Date(2023 + (index % 3), index % 12, (index % 25) + 1),

      salaryGrade: `G${(index % 6) + 1}`,

      baseSalary: 8000 + index * 500,

      allowances: {
        transport: 500 + index * 50,
        housing: 1500 + index * 100,
        medical: 300,
      },

      bankDetails: {
        bankName: "Banque Misr",
        accountNumber: `1234567890${String(index).padStart(2, "0")}`,
        iban: `EG380019000500000000263180${String(index).padStart(4, "0")}`,
      },

      emergencyContact: {
        name: `Emergency Contact ${index + 1}`,
        phone: `+2010012345${String(index).padStart(2, "2")}`,
        relation: index % 2 === 0 ? "Brother" : "Father",
      },

      status: "active",
    }),
  );

  const employees = await Employee.create(employeesData);

  console.log(`✅ ${employees.length} employee records created`);

  return employees;
};

// ========================================
// Create Tasks
// ========================================

const createTasks = async (employeeUsers, managerUsers, departments) => {
  console.log("📋 Creating tasks...");

  const tasksData = [];

  const taskTitles = [
    "Implement Authentication API",
    "Build Employee Management API",
    "Create Department Dashboard",
    "Implement Attendance System",
    "Build Payroll Module",
    "Create Task Management API",
    "Implement Notification System",
    "Fix Authentication Bugs",
    "Optimize Database Queries",
    "Create API Documentation",
    "Implement Password Reset",
    "Build Employee Reports",
    "Create Attendance Reports",
    "Implement Role Permissions",
    "Improve Dashboard Performance",
    "Create Department Reports",
    "Implement Search Functionality",
    "Add Pagination to Employees",
    "Implement Task Comments",
    "Create Manager Dashboard",
  ];

  const statusArray = ["pending", "in progress", "completed"];

  for (let i = 0; i < 50; i++) {
    const employee = employeeUsers[i % employeeUsers.length];
    const manager = managerUsers[i % managerUsers.length];
    const department = departments[i % departments.length];

    tasksData.push({
      title: `${taskTitles[i % taskTitles.length]} #${i + 1}`,

      description:
        "Complete this task according to the project requirements and make sure all tests are passing.",

      status: statusArray[i % statusArray.length],

      assignedTo: employee._id,

      assignedBy: manager._id,

      deadline: new Date(2026, 8, ((i * 2) % 25) + 1),

      department: department._id,

      comments: [
        {
          authorId: manager._id,
          text: "Please start working on this task.",
          createdAt: new Date(),
        },
      ],
    });
  }

  const tasks = await Task.create(tasksData);

  console.log(`✅ ${tasks.length} tasks created`);

  return tasks;
};

// ========================================
// Create Attendance
// ========================================

const createAttendance = async (employeeUsers, securityUsers) => {
  console.log("⏰ Creating attendance records...");

  const attendanceData = [];

  const statuses = ["present", "present", "present", "late", "absent"];

  for (
    let employeeIndex = 0;
    employeeIndex < employeeUsers.length;
    employeeIndex++
  ) {
    const employee = employeeUsers[employeeIndex];

    for (let day = 1; day <= 10; day++) {
      const date = new Date(2026, 7, day);

      const status = statuses[(employeeIndex + day) % statuses.length];

      const attendance = {
        employee: employee._id,

        date,

        status,

        markedBy: securityUsers[employeeIndex % securityUsers.length]._id,
      };

      if (status !== "absent") {
        attendance.checkIn = new Date(
          2026,
          7,
          day,
          status === "late" ? 9 : 8,
          status === "late" ? 30 : 55,
        );

        attendance.checkOut = new Date(2026, 7, day, 17, 0);
      }

      attendanceData.push(attendance);
    }
  }

  const attendance = await Attendance.create(attendanceData);

  console.log(`✅ ${attendance.length} attendance records created`);

  return attendance;
};

// ========================================
// Create Permissions
// ========================================

const createPermissions = async (employeeUsers) => {
  console.log("📝 Creating permission requests...");

  const permissionsData = [];

  const types = ["annual", "sick", "emergency", "unpaid"];

  const statuses = ["pending", "manager_approved", "hr_approved", "rejected"];

  for (let i = 0; i < 20; i++) {
    const employee = employeeUsers[i % employeeUsers.length];

    const startDate = new Date(2026, 8, (i % 20) + 1);

    const endDate = new Date(2026, 8, (i % 20) + 2);

    permissionsData.push({
      employeeID: employee._id,

      type: types[i % types.length],

      reason:
        i % 4 === 0
          ? "Annual vacation"
          : i % 4 === 1
            ? "Medical appointment"
            : i % 4 === 2
              ? "Family emergency"
              : "Personal leave",

      attachment:
        i % 3 === 0
          ? "https://example.com/attachments/document.pdf"
          : undefined,

      startDate,

      endDate,

      status: statuses[i % statuses.length],
    });
  }

  const permissions = await Permission.create(permissionsData);

  console.log(`✅ ${permissions.length} permissions created`);

  return permissions;
};

// ========================================
// Create Payroll
// ========================================

const createPayroll = async (employees) => {
  console.log("💰 Creating payroll records...");

  const payrollData = [];

  for (const employee of employees) {
    const baseSalary = employee.baseSalary || 8000;

    const transport = employee.allowances?.transport || 0;

    const housing = employee.allowances?.housing || 0;

    const medical = employee.allowances?.medical || 0;

    // Generate different deductions
    const absence = Math.floor(Math.random() * 500);

    const late = Math.floor(Math.random() * 300);

    const totalAllowances = transport + housing + medical;

    const totalDeductions = absence + late;

    const netSalary = baseSalary + totalAllowances - totalDeductions;

    payrollData.push({
      employee: employee.user,

      month: 8,

      year: 2026,

      baseSalary,

      allowances: {
        transport,
        housing,
        medical,
      },

      deductions: {
        absence,
        late,
      },

      netSalary,

      status:
        employee._id.toString().slice(-1) % 3 === 0
          ? "paid"
          : employee._id.toString().slice(-1) % 3 === 1
            ? "processed"
            : "draft",

      paidAt: Math.random() > 0.5 ? new Date(2026, 7, 30) : undefined,
    });
  }

  const payroll = await Payroll.create(payrollData);

  console.log(`✅ ${payroll.length} payroll records created`);

  return payroll;
};

// ========================================
// Create Notifications
// ========================================

const createNotifications = async (tasks) => {
  console.log("🔔 Creating notifications...");

  const notificationsData = [];

  tasks.forEach((task, index) => {
    notificationsData.push({
      recipient: task.assignedTo,

      type: "task_assigned",

      message: `You have been assigned a new task: ${task.title}`,

      relatedId: task._id,

      read: index % 3 === 0,
    });
  });

  const notifications = await Notification.create(notificationsData);

  console.log(`✅ ${notifications.length} notifications created`);

  return notifications;
};

// ========================================
// Main Seed Function
// ========================================

const seed = async () => {
  try {
    await connectDB();

    await clearDatabase();

    // ========================================
    // Users
    // ========================================

    const users = await createUsers();

    // ========================================
    // Departments
    // ========================================

    const departments = await createDepartments(users.managerUsers);

    // ========================================
    // Employee Collection
    // ========================================

    const employees = await createEmployees(
      users.admin,
      users.hrUsers,
      users.managerUsers,
      users.securityUsers,
      users.employeeUsers,
      departments,
    );

    // ========================================
    // Tasks
    // ========================================

    const tasks = await createTasks(
      users.employeeUsers,
      users.managerUsers,
      departments,
    );

    // ========================================
    // Attendance
    // ========================================

    const attendance = await createAttendance(
      users.employeeUsers,
      users.securityUsers,
    );

    // ========================================
    // Permissions
    // ========================================

    const permissions = await createPermissions(users.employeeUsers);

    // ========================================
    // Payroll
    // ========================================

    const payroll = await createPayroll(employees);

    // ========================================
    // Notifications
    // ========================================

    const notifications = await createNotifications(tasks);

    // ========================================
    // Summary
    // ========================================

    console.log("\n================================");
    console.log("🌱 SEED COMPLETED SUCCESSFULLY");
    console.log("================================");

    console.log(`Users: ${await User.countDocuments()}`);

    console.log(`Departments: ${await Department.countDocuments()}`);

    console.log(`Employees: ${await Employee.countDocuments()}`);

    console.log(`Tasks: ${await Task.countDocuments()}`);

    console.log(`Attendance: ${await Attendance.countDocuments()}`);

    console.log(`Permissions: ${await Permission.countDocuments()}`);

    console.log(`Payroll: ${await Payroll.countDocuments()}`);

    console.log(`Notifications: ${await Notification.countDocuments()}`);

    console.log("\n🔐 All users password: Test@1234");

    await mongoose.connection.close();

    console.log("🔌 Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ SEED FAILED");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seed();
