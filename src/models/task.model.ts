import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
  boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  finishedBy: Date,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
