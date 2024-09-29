import mongoose, { Document } from "mongoose";

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

export { IBoard, IUser };
