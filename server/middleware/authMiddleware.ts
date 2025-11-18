import express from "express";
import { validateJWT } from "../services/jwtHeaderService.js";

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