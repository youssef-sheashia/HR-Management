import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookie } from "express-validator";
import { promisify } from "util";
import transporter from "../utils/email.js";
const accessCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 15 * 60 * 1000,
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT__ACCESS_TOKEN_EXPIRES_IN,
    },
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
  );
  user.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  user.lastLoginAt = Date.now();
  await user.save({ validateBeforeSave: false });
  const accessCookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };

  const refreshCookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .status(200)
    .json({
      status: "success",
      message: "Logged in successfully",
      data: {
        user: {
          name: `${user.firstName} ${user.lastName}`,
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
});

export const logout = catchAsync(async (req, res, next) => {
  req.user.refreshToken = undefined;
  await req.user.save({ validateBeforeSave: false });
  res
    .cookie("accessToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 0,
    })
    .cookie("refreshToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 0,
    })
    .status(200)
    .json({
      status: "success",
      message: "Logged out successfully",
    });
});
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new AppError("please login again", 401));
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("please login again", 401));
  const hashtoken = crypto.createHash("sha256").update(token).digest("hex");
  if (hashtoken !== user.refreshToken)
    return next(new AppError("please login again", 401));
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT__ACCESS_TOKEN_EXPIRES_IN,
    },
  );
  res.cookie("accessToken", accessToken, accessCookieOptions).status(201).json({
    status: "success",
  });
});
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("user dose not exist", 400));
  const otp = Math.floor(100000 + Math.random() * 900000);
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
  user.ResetTokenExpiration = new Date(Date.now() + 5 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: `${email}`,
    subject: "Reset Password",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 15px;">
<tr>
<td align="center">

<table role="presentation"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;">

<tr>
<td style="background:#2563eb;padding:30px;text-align:center;">

<h1 style="margin:0;color:#ffffff;font-size:28px;">
HR Management
</h1>

<p style="margin:10px 0 0;color:#dbeafe;font-size:16px;">
Password Reset Verification
</p>

</td>
</tr>

<tr>
<td style="padding:35px 25px;text-align:center;">

<h2 style="margin-top:0;color:#1f2937;">
Your Verification Code
</h2>

<p style="color:#6b7280;font-size:16px;line-height:26px;">
Use the following OTP to reset your password.
This code is valid for only
<strong>5 minutes</strong>.
</p>

<div
style="
margin:30px auto;
padding:18px 25px;
background:#eff6ff;
border:2px dashed #2563eb;
border-radius:10px;
font-size:34px;
font-weight:bold;
letter-spacing:10px;
color:#2563eb;
display:inline-block;
">
${otp}
</div>

<p style="margin-top:25px;color:#6b7280;font-size:15px;line-height:24px;">
If you didn't request a password reset,
you can safely ignore this email.
</p>

</td>
</tr>

<tr>
<td
style="
padding:20px;
background:#f9fafb;
text-align:center;
font-size:13px;
color:#9ca3af;
">
© ${new Date().getFullYear()} HR Management. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
  });
  res.status(200).json({
    status: "success",
    message: "we send otp to your email check your inbox",
  });
});
export const verifyOTP = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;
  const hashOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    email,
    ResetTokenExpiration: { $gt: Date.now() },
  });
  if (!user)
    return next(new AppError("the otp is expire try again later", 400));
  if (hashOtp !== user.passwordResetToken)
    return next(new AppError("otp does not correct ", 400));
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_RESET_PASSWORD_SECRET,
    {
      expiresIn: "10m",
    },
  );
  res
    .cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    })
    .status(200)
    .json({
      status: "success",
    });
});
export const resetPassword = catchAsync(async (req, res, next) => {
  const password = req.body.password;
  const resetToken = req.cookies.resetToken;
  console.log(resetToken);
  if (!resetToken)
    return next(new AppError("something wrong verify otp again", 400));
  const decoded = await promisify(jwt.verify)(
    resetToken,
    process.env.JWT_RESET_PASSWORD_SECRET,
  );
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("something wrong verify otp again", 400));
  user.password = password;
  user.passwordResetToken = undefined;
  user.ResetTokenExpiration = undefined;
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  res
    .cookie("resetToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .status(200)
    .json({
      status: "success",
      message: "password changed successfuly please login ",
    });
});
