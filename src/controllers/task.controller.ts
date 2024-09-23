import mongoose from "mongoose";
import { Request, Response } from "express";
import TaskModel from "../models/task.model";
import UserModel from "../models/user.model";
import BoardModel from "../models/board.model";

const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, boardId, assignedTo } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).send("Title is required and must be a string");
    }
    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).send("Valid boardId is required");
    }
    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).send("Invalid assignedTo format");
    }

    const board = await BoardModel.findById(boardId);
    if (!board) {
      return res.status(404).send("Board not found");
    }

    let user = null;
    if (assignedTo) {
      user = await UserModel.findById(assignedTo);
      if (!user) {
        return res.status(404).send("User not found");
      }
    }

    const newTask = new TaskModel({
      title,
      description: description || "",
      board: boardId,
      assignedTo: user ? user._id : undefined,
    });
    await newTask.save();

    board.tasks.push(newTask._id);
    await board.save();

    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const assignTaskToUser = async (req: Request, res: Response) => {
  console.log("assignTaskToUser");
  try {
    const taskId = req.params.taskId;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).send("userId is required");
    }

    // Vi validerar att taskId och userId är giltiga ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid taskId format");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid userId format");
    }

    //Vi kontrollerar att task och user finns i databasen
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const task = await TaskModel.findById(taskId);
    if (!task) {
      res.status(404).send("Task not found");
      return;
    }

    task.assignedTo = user._id;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid taskId format");
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      res.status(404).send("Task not found");
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

// Put request to update task

const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid taskId format");
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).send("No updates provided");
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }

    if (updates.assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(updates.assignedTo)) {
        return res.status(400).send("Invalid assignedTo format");
      }

      const newUser = await UserModel.findById(updates.assignedTo);
      if (!newUser) {
        return res.status(404).send("User not found");
      }

      if (
        task.assignedTo &&
        task.assignedTo.toString() !== updates.assignedTo
      ) {
        const oldUser = await UserModel.findById(task.assignedTo);
        if (oldUser) {
          oldUser.tasks.pull(taskId);
          await oldUser.save();
        }
      }

      newUser.tasks.push(taskId);
      await newUser.save();
    }

    await TaskModel.findByIdAndUpdate(taskId, updates, { new: true });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid taskId format");
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }

    // Remove the task reference from the board's tasks array
    const board = await BoardModel.findById(task.board);
    if (board) {
      board.tasks.pull(taskId);
      await board.save();
    }

    // If the task is assigned to a user, remove the task reference from the user's assigned tasks
    if (task.assignedTo) {
      const user = await User.findById(task.assignedTo);
      if (user) {
        user.task.pull(taskId);
        await user.save();
      }
    }

    await TaskModel.findByIdAndDelete(taskId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTaskToUser,
};
