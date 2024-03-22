const errorMiddleware = (err, req, res, next) => {
  err.Message ||= "Internal Server Error";
  err.statusCode ||= 500;

  return res.status(err.statusCode).json({
    success: false,
    message: err.Message,
  });
};

const TryCatch = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { errorMiddleware, TryCatch };
