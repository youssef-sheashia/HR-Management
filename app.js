import express from "express";
import cookieParser from "cookie-parser";
import globalError from "./controllers/globalErrorHandeler.js";
import AppError from "./utils/appError.js";
import userRoute from "./routes/userRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import departmentRoute from "./routes/departmentRoute.js";
import taskRoute from "./routes/taskRoute.js";
import notificationRoute from "./routes/notificationsRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/department", departmentRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/attendance", attendanceRoute);
app.use((req, res, next) => {
  next(new AppError("this url not found", 404));
});
app.use(globalError);

export default app;
