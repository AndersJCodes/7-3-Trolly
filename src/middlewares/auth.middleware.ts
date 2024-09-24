import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  console.log(req.headers);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Unauthorized: Malformed token");
  }

  try {
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = { id: (user as JwtPayload).userId as string };
      next();
      console.log(req.user);
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(`Unauthorized: ${error.message}`);
    }
  }
};

export default authMiddleware;
