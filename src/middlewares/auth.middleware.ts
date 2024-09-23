import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    req.body.userId = (decoded as any).userId;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message);
    }
  }
};

export default authMiddleware;
