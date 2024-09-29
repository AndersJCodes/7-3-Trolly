import { Router } from "express";
import {
  createTask,
  getTasksFromBoard,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createTaskValidator,
  updateTaskValidator,
} from "../middlewares/task.validator";

const router = Router();

// Route to create a new task
router.post("/:boardId/tasks", createTaskValidator, createTask);

// Route to get all tasks from a specific board
router.get("/:boardId/tasks", getTasksFromBoard);

// Route to get a specific task by ID
router.get("/tasks/:taskId", getTaskById);

// Route to update a specific task by ID
router.put("/tasks/:taskId", updateTaskValidator, updateTask);

// Route to delete a specific task by ID
router.delete("/tasks/:taskId", deleteTask);

export default router;
