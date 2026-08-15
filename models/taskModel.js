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
    comments: [
      {
        authorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        text: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);
taskSchema.pre(/^find/, function () {
  this.populate({ path: "assignedTo", select: "firstName lastName emsil" })
    .populate({ path: "assignedBy", select: "firstName lastName email" })
    .populate({ path: "department", select: "name" });
});
const Task = mongoose.model("Task", taskSchema);
export default Task;
