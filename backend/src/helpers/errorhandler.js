const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = res.statusCode >= 400 ? res.statusCode : err.status || 500;
  const production =
    process.env.NODE_ENV === "production" || process.env.RENDER === "true";
  if (!production) console.error(err);
  res.status(status).json({
    message:
      production && status >= 500
        ? "An unexpected error occurred"
        : err.message,
    ...(production ? {} : { stack: err.stack }),
  });
};

export default errorHandler;
