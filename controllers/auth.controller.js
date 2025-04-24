import catchAsync from "../utils/catchAsync.js";

import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import Email from "../utils/email.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";

const signToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
  });
  return token;
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new AppError(
        "No account for given email found. Please register first and then try again",
        400
      )
    );
  }

  if (!(await user.arePasswordsEqual(password, user.password))) {
    return next(new AppError("Invalid email or password"));
  }

  const token = signToken(user?.id, res);
  user.password = undefined;

  res.json({
    status: "success",
    token,
    user,
  });
});

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({ name, email, password });

  const token = signToken(newUser?.id, res);

  newUser.password = undefined;

  res.json({
    status: "success",
    token,
    user: newUser,
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("No user with this email exits", 400));

  const token = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;

  console.log("Reset URL", resetUrl);

  try {
    const emailSender = new Email(user, resetUrl);
    await emailSender.sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Check your email for resetting password",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);

    return next(
      new AppError("An error occured while sending email. Try again later")
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordTokenExpiresIn: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("No such user exists or token expired"));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiresIn = undefined;
  await user.save();

  const token = signToken(user._id, res);
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});
