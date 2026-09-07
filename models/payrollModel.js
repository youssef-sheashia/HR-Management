import mongoose from "mongoose";
const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    allowances: {
      transport: {
        type: Number,
        default: 0,
      },
      housing: {
        type: Number,
        default: 0,
      },
      medical: {
        type: Number,
        default: 0,
      },
    },

    deductions: {
      absence: {
        type: Number,
        default: 0,
      },
      late: {
        type: Number,
        default: 0,
      },
    },

    netSalary: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "paid"],
      default: "draft",
    },

    paidAt: Date,
  },
  {
    timestamps: true,
  },
);
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
const Payroll = mongoose.model("Payroll", payrollSchema);
export default Payroll;
