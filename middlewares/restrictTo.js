import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

const restrictTo = (...allowed) => {
  return (req, res, next) => {
    if (!allowed.includes(req.user.rule)) {
      return next(
        new AppError("you do not have the permission to do that action", 403),
      );
    }
    next();
  };
};
