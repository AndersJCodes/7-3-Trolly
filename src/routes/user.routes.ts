import { Router } from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import {
  createUserValidator,
  updateUserValidator,
} from "../middlewares/user.validator";
import handleValidationErrors from "../middlewares/validation.middleware";
import authMiddleware from "src/middlewares/auth.middleware";

const router = Router();

router.post("/", createUserValidator, handleValidationErrors, createUser);
router.post("/login", loginUser);
router.get("/protected-route", authMiddleware, (req, res) => {
  res.send("You are authorized to access this route");
});
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put(
  "/:id",
  updateUserValidator,
  authMiddleware,
  handleValidationErrors,
  updateUser
);
router.delete("/:id", deleteUser);

export default router;
