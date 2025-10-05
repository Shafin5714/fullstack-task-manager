import { Router } from "express";
import userRoutes from "./user.routes";
import taskRoutes from "./task.routes";
const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: API status check
 *     description: Returns a simple message confirming that the Task Manager API is reachable.
 *     responses:
 *       200:
 *         description: API is running and accessible.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: Api running.
 */
router.get("/", (req, res) => {
  res.status(200).send("Api running.");
});

router.use("/api/user", userRoutes);
router.use("/api/tasks", taskRoutes);

export default router;
