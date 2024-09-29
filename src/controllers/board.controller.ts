import { Request, Response } from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import Board from "../models/board.model";
import User from "../models/user.model";
import Task from "../models/task.model";
import { isUserBoardMember } from "../utils/isUserBoardMember";

const createBoard = async (req: Request, res: Response) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    const board = new Board({ title, description, members: [userId] });

    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getAllBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const boards = await Board.find({ members: userId });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isMember = await isUserBoardMember(id, userId);
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a member of this board." });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getBoardWithTasksById = async (req: Request, res: Response) => {
  console.log("getBoardWithTasksById");
  try {
    const { id } = req.params; // 'id' is the board ID
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate board ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid board ID format" });
    }

    // Verify that the user is a member of the board
    const isMember = await isUserBoardMember(id, userId);
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a member of this board." });
    }

    // Find the board
    const board = await Board.findById(id).populate(
      "members",
      "username email"
    );
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Find tasks associated with the board
    const tasks = await Task.find({ boardId: board._id });

    // Combine the board data with its tasks
    const boardWithTasks = {
      ...board.toObject(),
      tasks: tasks,
    };

    console.log("board:", board);

    res.status(200).json(boardWithTasks);
  } catch (error) {
    console.error("Error fetching board with tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateBoard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const boardId = req.params.id;
    const updateBoard = req.body;

    console.log("userId", userId);
    console.log("boardId", boardId);
    console.log("reqbody", updateBoard);

    //Check to see if userId is defined
    if (!userId) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ error: "Invalid board ID format" });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      { _id: boardId, users: userId },
      updateBoard,
      { new: true }
    );

    if (!boardId) {
      return res.status(403).json({ error: "Board not found." });
    }
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.id;
    const userId = req.user?.id;

    const board = await Board.findByIdAndDelete({
      _id: boardId,
      users: userId,
    });

    if (!board) {
      return res
        .status(403)
        .json({ error: "Access denied or board not found." });
    }
    res.status(200).json({ message: "Board deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const addUserToBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.id;
    const { userId } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify that the current user is a member of the board
    const isMember = await isUserBoardMember(boardId, currentUserId);
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a member of this board." });
    }

    const updateBoard = await Board.findById(boardId);
    const user = await User.findById(userId);
    if (!updateBoard || !user) {
      return res.status(404).json({ error: "Board or user not found" });
    }

    // Add the new user to the board
    await Board.updateOne({ _id: boardId }, { $addToSet: { members: userId } });

    res.status(200).json(updateBoard);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const removeUserFromBoard = async (req: Request, res: Response) => {
  try {
    const { id: boardId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the current user is a member of the board
    const isMember = await isUserBoardMember(boardId, currentUserId);
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a member of this board." });
    }

    // Fetch board and verify if it exists
    const updateBoard = await Board.findById(boardId);
    if (!updateBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Ensure the user is in the board members and not the last member
    if (!updateBoard.members.includes(userId)) {
      return res.status(404).json({ error: "User not found in board members" });
    }

    if (updateBoard.members.length <= 1) {
      return res
        .status(400)
        .json({ error: "Cannot remove the last user from the board" });
    }

    // Remove the user from the board
    await Board.updateOne({ _id: boardId }, { $pull: { members: userId } });

    res.status(200).json({ message: "User successfully removed from board" });
  } catch (error) {
    console.error("Error removing user from board:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  createBoard,
  getAllBoards,
  getBoardById,
  getBoardWithTasksById,
  updateBoard,
  deleteBoard,
  addUserToBoard,
  removeUserFromBoard,
};
