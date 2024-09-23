import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  assignTaskToUser,
  deleteTask,
} from "../controllers/task.controller";

const router = Router();

router.put("/:taskId/assign", assignTaskToUser);
router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
