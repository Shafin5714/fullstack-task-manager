import Task from "../models/task.model";
import { Request, Response, NextFunction } from "express";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tasks = await Task.find()
    .populate("assignedUser", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, status, assignedUser, dueDate, priority } =
    req.body;

  if (!title || !description || !assignedUser || !dueDate) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide all required fields: title, description, assignedUser, dueDate",
    });
  }

  // Type assertion
  const userId = (req as any).user._id;

  const task = await Task.create({
    id: userId,
    title,
    description,
    status: status || "Pending",
    assignedUser,
    dueDate,
    priority: priority || "Medium",
    createdBy: userId,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("assignedUser", "name email")
    .populate("createdBy", "name email");

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: populatedTask,
  });
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, status, assignedUser, dueDate, priority } =
    req.body;

  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Update task fields
  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (assignedUser !== undefined) updateData.assignedUser = assignedUser;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (priority !== undefined) updateData.priority = priority;

  task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("assignedUser", "name email")
    .populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: {},
  });
};
