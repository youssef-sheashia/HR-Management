import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userShcema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first Name is required"],
      min: 3,
      max: 12,
    },
    lastName: {
      type: String,
      required: [true, "first Name is required"],
      min: 3,
      max: 12,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email is already exist"],
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profileImg: String,
    rule: {
      type: String,
      enum: ["admin", "manager", "hr", "employee", "security"],
      required: [true, "rule is required"],
    },
    refreshToken: {
      type: String,
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    changedPasswordAt: Date,
    passwordResetToken: String,
    ResetTokenExpiration: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
userShcema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userShcema);
export default User;
