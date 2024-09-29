import mongoose, { Schema, Document, Types } from "mongoose";

// Define the Task interface extending Mongoose's Document
interface ITask extends Document {
  boardId: Types.ObjectId;
  title: string;
  status: "To Do" | "In Progress" | "Done";
  createdAt: Date;
  description?: string | null;
  finishedBy?: Date | null;
  assignedTo?: Types.ObjectId | null;
}

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
export { ITask };
