import { Request, Response } from "express";
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import hashPassword from "src/utils/hashPassword";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req: Request, res: Response) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({ ...userData, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID format");
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID format");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!req.user || user._id.toString() !== req.user.id) {
      return res
        .status(403)
        .send("Access denied. You can only update your own profile.");
    }

    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID format");
    }

    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

export {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
