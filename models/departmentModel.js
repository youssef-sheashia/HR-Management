import mongoose from "mongoose";
import { required } from "zod/mini";
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
departmentSchema.pre(/^find/, function () {
  this.populate({ path: "manager", select: "firstName lastName email" });
});
const Department = mongoose.model("Department", departmentSchema);
export default Department;
