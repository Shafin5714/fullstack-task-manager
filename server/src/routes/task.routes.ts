import { Router } from "express";
import {
  getAllTasks,
  createTask,
  deleteTask,
} from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(protect, getAllTasks).post(protect, createTask);
router.route("/:id").delete(protect, deleteTask);

export default router;
