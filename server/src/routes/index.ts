import { Router } from "express";
import userRoutes from "./user.routes";
import taskRoutes from "./task.routes";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).send("Api running.");
});

router.use("/api/user", userRoutes);
router.use("/api/tasks", taskRoutes);

export default router;
