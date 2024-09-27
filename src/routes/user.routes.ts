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
import handleValidationErrors from "../middlewares/validation.middleware";

const router = Router();

router.post("/", createUserValidator, handleValidationErrors, createUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put(
  "/:id",
  authMiddleware,
  updateUserValidator,
  handleValidationErrors,
  updateUser
);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
