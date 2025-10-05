import { Router } from "express";
import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(protect, getAllTasks).post(protect, createTask);
router.route("/:id").delete(protect, deleteTask);
router.route("/:id").put(protect, updateTask);

export default router;
