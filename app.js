import express from "express";
import cookieParser from "cookie-parser";
import globalError from "./controllers/globalErrorHandeler.js";
import userRoute from "./routes/userRoute.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRoute);
app.use(globalError);

export default app;
