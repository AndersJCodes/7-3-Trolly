import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/boardInterface";

// Define the Task schema
const taskSchema = new Schema({
  boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  title: { type: String, required: true },
  description: { type: String, default: null },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  finishedBy: { type: Date, default: null },
});

// Create the Task model
const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
