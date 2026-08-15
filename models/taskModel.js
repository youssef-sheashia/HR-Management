import mongoose from "mongoose";
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deadline: {
      type: Date,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  { timestamps: true },
);
const Task = mongoose.model("Task", taskSchema);
export default Task;
