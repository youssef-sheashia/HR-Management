import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const restrictTo = (...allowed) => {
  return (req, res, next) => {
    if (!allowed.includes(req.user.role)) {
      return next(
        new AppError("you do not have the permission to do that action", 403),
      );
    }
    next();
  };
};
export default restrictTo;
