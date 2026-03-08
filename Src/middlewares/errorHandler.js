export const errorHandler = (err, req, res, next) => {

  console.error("GLOBAL ERROR:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(", ");
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message
  });

};