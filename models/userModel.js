import mongoose from "mongoose";
const userShcema = new mongoose.Schema({
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
});
const User = mongoose.model("User", userShcema);
export default User;
