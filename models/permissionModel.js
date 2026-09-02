import mongoose from "mongoose";
const permissionSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
permissionSchema.index(
  { employeeID: 1, startDate: 1, endDate: 1 },
  { unique: true },
);
permissionSchema.pre(/^find/, function () {
  this.populate({ path: "employeeID", select: "firstName lastName email" });
});
const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;
