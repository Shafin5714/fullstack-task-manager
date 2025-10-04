import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedUser: mongoose.Types.ObjectId;
  dueDate: Date;
  createdBy: mongoose.Types.ObjectId;
  priority: "Low" | "Medium" | "High";
  createdAt: Date;
  updatedAt: Date;
  isOverdue: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a task description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Pending",
    },
    assignedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please assign a user to this task"],
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide a due date"],
      validate: {
        validator: function (value: Date) {
          return value >= new Date();
        },
        message: "Due date must be in the future",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ status: 1, dueDate: 1 });

taskSchema.virtual("isOverdue").get(function () {
  return this.status !== "Completed" && this.dueDate < new Date();
});

// Pre-save middleware
taskSchema.pre("save", function (next) {
  if (this.isModified("dueDate") && this.dueDate < new Date()) {
    next(new Error("Due date cannot be in the past"));
  }
  next();
});

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
