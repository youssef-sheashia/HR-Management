import AppError from "../utils/appError.js";

function castError(err) {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
}

function duplicateError(err) {
  const duplicate =
    err.keyValue || err.cause?.keyValue || err.cause?.errorResponse?.keyValue;

  if (!duplicate) {
    return new AppError("Duplicate field value", 400);
  }

  const field = Object.keys(duplicate)[0];
  const value = duplicate[field];

  return new AppError(`${field} "${value}" already exists`, 400);
}
function ValidationError(err) {
  const error = Object.values(err.errors)
    .map((el) => el.message)
    .join(".  ");
  return new AppError(`Invalid input data. ${error}`, 400);
}

function devError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}
function prodError(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("error🐦‍🔥", err);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
}
function globalError(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    devError(err, res);
  } else {
    // production or other fallback environments
    if (err.name === "CastError") err = castError(err);
    if (
      err.code === 11000 ||
      err.cause?.code === 11000 ||
      err.cause?.errorResponse?.code === 11000
    ) {
      err = duplicateError(err);
    }
    if (err.name === "ValidationError") err = ValidationError(err);
    if (err.name === "JsonWebTokenError")
      err = new AppError("Invalid token. Please log in again.", 401);
    if (err.name === "TokenExpiredError")
      err = new AppError("Your token has expired. Please log in again.", 401);

    prodError(err, res);
  }
}
export default globalError;
