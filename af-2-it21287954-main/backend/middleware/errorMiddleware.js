// File: backend/middleware/errorMiddleware.js
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Check for Mongoose duplicate key error
  if (err.code === 11000) {
    message = 'User already exists';
    statusCode = 400;
  }

  // Check for Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Extract error messages from the ValidationError object
    message = Object.values(err.errors)
      .map((el) => el.message)
      .join(', ');
  }

  res.status(statusCode);
  res.json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };