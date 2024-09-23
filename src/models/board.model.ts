import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
