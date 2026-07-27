import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    nationalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    contractType: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      default: "full-time",
    },

    hireDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    salaryGrade: {
      type: String,
      trim: true,
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

    bankDetails: {
      bankName: String,
      accountNumber: String,
      iban: String,
    },

    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },

    status: {
      type: String,
      enum: ["active", "on_leave", "suspended", "terminated"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
