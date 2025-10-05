import { Router } from "express";
import { getAllTasks, createTask } from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(protect, getAllTasks).post(protect, createTask);

export default router;
