import { Router } from "express";
import {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardById,
  getBoardWithTasksById,
  getAllBoards,
  addUserToBoard,
  removeUserFromBoard,
} from "../controllers/board.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

//TODO Consider middleware to controll board values

router.post("/", createBoard);
router.get("/", getAllBoards);
router.get("/:id", getBoardById);
router.get("/:id/tasks", getBoardWithTasksById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.post("/:id/users/", addUserToBoard);
router.delete("/:id/users/", removeUserFromBoard);

export default router;
