import mongoose, { Schema, Model } from "mongoose";
import { IBoard } from "../types/boardInterface";

const boardSchema = new Schema<IBoard>({
  title: { type: String, required: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Board: Model<IBoard> = mongoose.model<IBoard>("Board", boardSchema);

export default Board;
