import { Router } from "express";
import {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoard,
  getBoards,
  addUserToBoard,
  addTaskToBoard,
} from "../controllers/board.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.get("/:id", getBoard);
router.get("/", getBoards);
router.post("/:boardId/users/:userId", addUserToBoard);
router.post("/:boardId/tasks/:taskId", addTaskToBoard);

export default router;
