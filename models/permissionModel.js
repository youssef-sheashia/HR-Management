import mongoose from "mongoose";
const permissionSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      enum: ["annual", "sick", "emergency", "unpaid"],
      required: true,
    },
    reason: String,
    attachment: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "manager_approved", "hr_approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);
const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;