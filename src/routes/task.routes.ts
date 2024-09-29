import { Router } from "express";
import {
  createTask,
  getTasksFromBoard,
  getTaskById,
  updateTask,
  deleteTask,
  assignTaskToUser,
  removeTaskFromUser,
} from "../controllers/task.controller";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createTaskValidator,
  updateTaskValidator,
} from "../middlewares/task.validator";

const router = Router();
router.use(authMiddleware);

router.post("/:boardId/tasks", createTaskValidator, createTask);
router.get("/:boardId/tasks", getTasksFromBoard);
router.get("/tasks/:taskId", getTaskById);
router.put("/tasks/:taskId", updateTaskValidator, updateTask);
router.delete("/tasks/:taskId", deleteTask);
router.post("/tasks/:taskId/assign", assignTaskToUser);
router.delete("/tasks/:taskId/assign", removeTaskFromUser);

export default router;
