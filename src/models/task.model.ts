import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: String,
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  createdAt: { type: Date, default: Date.now },
  finishedBy: Date,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
