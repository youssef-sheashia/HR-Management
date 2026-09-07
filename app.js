import express from "express";
import cookieParser from "cookie-parser";
import globalError from "./controllers/globalErrorHandeler.js";
import AppError from "./utils/appError.js";
import userRoute from "./routes/userRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import departmentRoute from "./routes/departmentRoute.js";
import taskRoute from "./routes/taskRoute.js";
import notificationRoute from "./routes/notificationsRoute.js";

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";

import attendanceRoute from "./routes/attendanceRoute.js";
import permissionRoute from "./routes/permissionRoute.js";
import payrollRoute from "./routes/payrollRoute.js";
const app = express();
app.use(helmet());
app.use(cors());
app.set("trust proxy", 1);
app.use(
  "/api",
  rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again later.",
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/departments", departmentRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/attendances", attendanceRoute);
app.use("/api/v1/permissions", permissionRoute);
app.use("/api/v1/payrolls", payrollRoute);
app.use((req, res, next) => {
  next(new AppError("this url not found", 404));
});
app.use(globalError);

export default app;
