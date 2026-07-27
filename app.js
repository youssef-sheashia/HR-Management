import express from "express";
import cookieParser from "cookie-parser";
import globalError from "./controllers/globalErrorHandeler.js";
import userRoute from "./routes/userRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import AppError from "./utils/appError.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/employees", employeeRoute);
app.use((req, res, next) => {
  next(new AppError("this url not found", 404));
});
app.use(globalError);

export default app;
