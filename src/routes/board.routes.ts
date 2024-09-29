import { Router } from "express";
import {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardById,
  getAllBoards,
  addUserToBoard,
  removeUserFromBoard,
} from "../controllers/board.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createBoard);
router.get("/", getAllBoards);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.post("/:id/users/", addUserToBoard);
router.delete("/:id/users/", removeUserFromBoard);

export default router;
