import express from "express";
import { jwtMiddleware } from "../middleware/authMiddleware.js";
import { sendAiMessage } from "../services/aiMessageService.js";
import { getEmailFromJWT } from "../services/jwtHeaderService.js";
import { getToolCalls } from "../services/toolCallService.js";
import { MessageArraySchema } from "../zod-types/messageModel.js";
import { ToolArraySchema } from "../zod-types/toolModel.js";

const router = express.Router();

router.post("/ai/messages", jwtMiddleware, async (req, res, next) => {
  try {
    const username = getEmailFromJWT(req.headers.authorization);
    if (!username) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const messages = MessageArraySchema.parse(req.body.messages);
    const tools = req.body.tools ? ToolArraySchema.parse(req.body.tools) : undefined;

    const aiResponse = await sendAiMessage(username, messages, tools);
    res.json(aiResponse);
  } catch (err) {
    next(err);
  }
});

router.get("/tool-calls", jwtMiddleware, async (req, res, next) => {
  try {
    const username = getEmailFromJWT(req.headers.authorization);
    if (!username) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const toolCalls = await getToolCalls(username);
    res.json(toolCalls);
  } catch (err) {
    next(err);
  }
});

export default router;
