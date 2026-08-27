import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import Employee from "../models/employeeModel.js";
import Department from "../models/departmentModel.js";
import Task from "../models/taskModel.js";
import Attendance from "../models/attendanceModel.js";
import Notification from "../models/notificationModel.js";

dotenv.config({ path: "./config.env" });

const DB = process.env.LOCAL_DATABASE;

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

  // =========================
  // Admin
  // =========================

  const admin = await User.create({
    firstName: "Ahmed",
    lastName: "Admin",
    email: "admin@hrsystem.com",
    password: "12345678",
    role: "admin",
  });

  // =========================
  // HR
  // =========================

  const hrUsers = await User.create([
    {
      firstName: "Mona",
      lastName: "Hassan",
      email: "mona.hr@hrsystem.com",
      password: "12345678",
      role: "hr",
    },
    {
      firstName: "Omar",
      lastName: "Khaled",
      email: "omar.hr@hrsystem.com",
      password: "12345678",
      role: "hr",
    },
  ]);

  // =========================
  // Managers
  // =========================

  const managerUsers = await User.create([
    {
      firstName: "Mohamed",
      lastName: "Ali",
      email: "mohamed.manager@hrsystem.com",
      password: "12345678",
      role: "manager",
    },
    {
      firstName: "Sara",
      lastName: "Mahmoud",
      email: "sara.manager@hrsystem.com",
      password: "12345678",
      role: "manager",
    },
    {
      firstName: "Youssef",
      lastName: "Ahmed",
      email: "youssef.manager@hrsystem.com",
      password: "12345678",
      role: "manager",
    },
    {
      firstName: "Nour",
      lastName: "Ibrahim",
      email: "nour.manager@hrsystem.com",
      password: "12345678",
      role: "manager",
    },
  ]);

  // =========================
  // Security
  // =========================

  const securityUsers = await User.create([
    {
      firstName: "Hany",
      lastName: "Security",
      email: "hany.security@hrsystem.com",
      password: "12345678",
      role: "security",
    },
    {
      firstName: "Tamer",
      lastName: "Security",
      email: "tamer.security@hrsystem.com",
      password: "12345678",
      role: "security",
    },
    {
      firstName: "Mostafa",
      lastName: "Security",
      email: "mostafa.security@hrsystem.com",
      password: "12345678",
      role: "security",
    },
  ]);

  // =========================
  // Employees
  // =========================

  const employeeUsers = await User.create([
    {
      firstName: "Ali",
      lastName: "Hassan",
      email: "ali.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Omar",
      lastName: "Mohamed",
      email: "omar.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Mostafa",
      lastName: "Ahmed",
      email: "mostafa.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Mahmoud",
      lastName: "Samir",
      email: "mahmoud.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Karim",
      lastName: "Hassan",
      email: "karim.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Amr",
      lastName: "Khaled",
      email: "amr.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Yassin",
      lastName: "Ali",
      email: "yassin.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Hassan",
      lastName: "Ibrahim",
      email: "hassan.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Khaled",
      lastName: "Mahmoud",
      email: "khaled.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Eslam",
      lastName: "Ahmed",
      email: "eslam.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Adham",
      lastName: "Mohamed",
      email: "adham.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Ayman",
      lastName: "Hassan",
      email: "ayman.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Maher",
      lastName: "Ali",
      email: "maher.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Seif",
      lastName: "Khaled",
      email: "seif.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Ziad",
      lastName: "Ahmed",
      email: "ziad.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Fady",
      lastName: "Mahmoud",
      email: "fady.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Bassem",
      lastName: "Ibrahim",
      email: "bassem.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Tarek",
      lastName: "Samir",
      email: "tarek.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Walid",
      lastName: "Hassan",
      email: "walid.employee@hrsystem.com",
      password: "12345678",
      role: "employee",
    },
    {
      firstName: "Ramy",
      lastName: "Mohamed",
      email: "ramy.employee@hrsystem.com",
      password: "12345678",
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

const createEmployees = async (employeeUsers, departments) => {
  console.log("👨‍💻 Creating employees...");

  const employeesData = employeeUsers.map((user, index) => {
    const department = departments[index % departments.length];

    return {
      user: user._id,

      nationalId: `29${String(index + 1).padStart(12, "0")}`,

      department: department._id,

      jobTitle:
        index % 4 === 0
          ? "Backend Developer"
          : index % 4 === 1
            ? "Frontend Developer"
            : index % 4 === 2
              ? "Software Engineer"
              : "System Administrator",

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
        iban: `EG380019000500000000263180${String(index).padStart(2, "4")}`,
      },

      emergencyContact: {
        name: `Emergency Contact ${index + 1}`,
        phone: `+2010012345${String(index).padStart(2, "2")}`,
        relation: index % 2 === 0 ? "Brother" : "Father",
      },

      status: "active",
    };
  });

  const employees = await Employee.create(employeesData);

  console.log(`✅ ${employees.length} employees created`);

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

  for (let i = 0; i < 50; i++) {
    const employee = employeeUsers[i % employeeUsers.length];

    const manager = managerUsers[i % managerUsers.length];

    const department = departments[i % departments.length];

    const statusArray = ["pending", "in progress", "completed"];

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
// Create Notifications
// ========================================

const createNotifications = async (employeeUsers, tasks) => {
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

    const users = await createUsers();

    const departments = await createDepartments(users.managerUsers);

    const employees = await createEmployees(users.employeeUsers, departments);

    const tasks = await createTasks(
      users.employeeUsers,
      users.managerUsers,
      departments,
    );

    const attendance = await createAttendance(
      users.employeeUsers,
      users.securityUsers,
    );

    const notifications = await createNotifications(users.employeeUsers, tasks);

    console.log("\n================================");
    console.log("🌱 SEED COMPLETED SUCCESSFULLY");
    console.log("================================");

    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Departments: ${await Department.countDocuments()}`);
    console.log(`Employees: ${await Employee.countDocuments()}`);
    console.log(`Tasks: ${await Task.countDocuments()}`);
    console.log(`Attendance: ${await Attendance.countDocuments()}`);
    console.log(`Notifications: ${await Notification.countDocuments()}`);

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
