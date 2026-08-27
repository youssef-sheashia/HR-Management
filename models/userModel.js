import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first Name is required"],
      minlength: 3,
      maxlength: 12,
    },
    lastName: {
      type: String,
      required: [true, "first Name is required"],
      minlength: 3,
      maxlength: 12,
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
      select: false,
    },
    profileImg: String,
    role: {
      type: String,
      enum: ["admin", "manager", "hr", "employee", "security"],
      required: [true, "role is required"],
    },
    refreshToken: {
      type: String,
    },
    lastLoginAt: Date,
    changedPasswordAt: Date,
    passwordResetToken: String,
    ResetTokenExpiration: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});
userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) return;

  this.changedPasswordAt = Date.now() - 1000;
});
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const changedTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);
export default User;
