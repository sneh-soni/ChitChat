import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies["Token"];

  if (!token)
    return next(new ErrorHandler("Please Login to access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
};

const isAdmin = (req, res, next) => {
  const adminToken = req.cookies["admin-token"];

  if (!adminToken)
    return next(new ErrorHandler("Only Admins can access this route", 401));

  const secretKey = jwt.verify(adminToken, process.env.JWT_SECRET);

  const isMatched = secretKey === process.env.ADMIN_SECRET_KEY;

  if (!isMatched) return next(new ErrorHandler("Invalid Secret Key", 401));

  next();
};

export { isAuthenticated, isAdmin };
