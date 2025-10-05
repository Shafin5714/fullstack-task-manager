import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password",
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  const token = generateToken(String(user._id));

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(String(user._id));

  res.json({
    success: true,
    message: "Login successful.",
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find().select("-password").sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};
