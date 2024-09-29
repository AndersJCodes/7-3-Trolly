import mongoose, { Document, Types } from "mongoose";

interface IBoard extends Document {
  title: string;
  description?: string;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

interface ITask extends Document {
  boardId: Types.ObjectId;
  title: string;
  status: "To Do" | "In Progress" | "Done";
  createdAt: Date;
  description?: string | null;
  finishedBy?: Date | null;
  assignedTo?: Types.ObjectId | null;
}

export { IBoard, IUser, ITask };
