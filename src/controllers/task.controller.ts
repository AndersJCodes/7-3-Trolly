import { Request, Response } from "express";
import Task, { ITask } from "../models/task.model";
import { isUserBoardMember } from "../utils/isUserBoardMember";

const createTask = async (req: Request, res: Response) => {
  try {
    
    const boardId = req.params.boardId;
    const { title, status, description, assignedTo } = req.body;
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

    // Create a new task instance
    const newTask: ITask = new Task({
      boardId,
      title,
      status,
      description,
      assignedTo,
      createdAt: new Date(),
    });

    // Save the task to the database
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const getTasksFromBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.boardId;
    const tasks = await Task.find({ boardId });
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).send("Task not found");
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

const assignTaskToUser = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const { userId } = req.body;

    const task = await
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
};

export { createTask, getTasksFromBoard, getTaskById, updateTask, deleteTask };
