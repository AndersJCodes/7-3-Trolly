import express, { Express, Request, Response } from "express";
import cors from "cors";
import "./loadEnvironment";
import connectToDb from "./db/dbConnection";
import userRouter from "./routes/user.routes";
import taskRouter from "./routes/task.routes";
import boardRouter from "./routes/board.routes";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

connectToDb();

// Routes
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/boards", boardRouter);

app.listen(PORT, () => {
  console.log(`[server]: Server is running on http://localhost:${PORT}`);
});
