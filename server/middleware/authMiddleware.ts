import express from "express";
import { validateJWT, isAdmin } from "../services/jwtHeaderService.js";

export const jwtMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (!await validateJWT(req.headers.authorization)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  } catch (err) {
    console.error("JWT validation error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const adminMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isAdmin(req.headers.authorization)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};
