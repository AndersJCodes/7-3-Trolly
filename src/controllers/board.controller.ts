import { Request, Response } from "express";
import mongoose from "mongoose";
import Board from "../models/board.model";
import Task from "../models/task.model";
import User from "../models/user.model";

const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const board = new Board({ title, description });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const board = await Board.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await Board.findByIdAndDelete(id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json({ message: "Board deleted" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const getBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await Board.findById(id).populate("tasks").populate("users");
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const getBoards = async (req: Request, res: Response) => {
  try {
    // Assuming the user ID is attached to the request object by an authentication middleware
    const userId = req.user?.id;

    const boards = await Board.find({ users: userId })
      .populate("tasks")
      .populate("users");
    res.status(200).json(boards);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const addUserToBoard = async (req: Request, res: Response) => {
  try {
    const { boardId, userId } = req.params;
    const board = await Board.findById(boardId);
    const user = await User.findById(userId);
    if (!board || !user) {
      return res.status(404).json({ error: "Board or User not found" });
    }
    board.users.push(user._id);
    await board.save();
    res.status(200).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const removeUserFromBoard = async (req: Request, res: Response) => {
  try {
    const { boardId, userId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.users.length <= 1) {
      return res
        .status(400)
        .json({ error: "Cannot remove the last user from the board" });
    }

    const user = await User.findById(userId); // Fetch the user from the database
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userIndex = board.users.indexOf(userObjectId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found on the board" });
    }

    board.users.splice(userIndex, 1);
    await board.save();

    res.status(200).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const addTaskToBoard = async (req: Request, res: Response) => {
  try {
    const { boardId, taskId } = req.params;
    const { userId } = req.body; // Optional userId in the request body
    const board = await Board.findById(boardId);
    const task = await Task.findById(taskId);
    if (!board || !task) {
      return res.status(404).json({ error: "Board or Task not found" });
    }
    board.tasks.push(task._id);

    if (userId) {
      const user = await User.findById(userId);
      if (user && !board.users.includes(user._id)) {
        board.users.push(user._id);
      }
    }

    await board.save();
    res.status(200).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const removeTaskFromBoard = async (req: Request, res: Response) => {
  try {
    const { boardId, taskId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const taskObjectId = new mongoose.Types.ObjectId(taskId);
    const taskIndex = board.tasks.indexOf(taskObjectId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found on the board" });
    }

    board.tasks.splice(taskIndex, 1);
    await board.save();

    res.status(200).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoard,
  getBoards,
  addUserToBoard,
  removeUserFromBoard,
  addTaskToBoard,
  removeTaskFromBoard,
};
