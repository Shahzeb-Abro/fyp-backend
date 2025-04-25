import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authorize = catchAsync(async (req, res, next) => {
  const token = req.cookies?.jwt;

  console.log("Token", token);

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to continue.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }

  req.user = currentUser;
  next();
});
