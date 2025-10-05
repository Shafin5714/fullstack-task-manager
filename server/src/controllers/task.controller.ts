import Task from "../models/task.model";
import { Request, Response } from "express";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate("assignedUser", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
