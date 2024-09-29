import { Router } from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import authMiddleware from "src/middlewares/auth.middleware";
import {
  createUserValidator,
  updateUserValidator,
} from "../middlewares/user.validator";

const router = Router();

//auth routes
router.post("/", createUserValidator, createUser);
router.post("/login", loginUser);

//user routes
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUserValidator, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
