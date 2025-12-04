import "dotenv/config";
import express from "express";
import cors from "cors";
import { getSubsectionMasteries, getQuestionsForSubsection, recordAnswer } from "./services/databaseService.js";
import { jwtMiddleware } from "./middleware/authMiddleware.js";
import { getEmailFromJWT } from "./services/jwtHeaderService.js";
import { AnswerSubmissionSchema } from "./zod-types/answerSubmissionModel.js";
import { MessageArraySchema } from "./zod-types/messageModel.js";
import { ToolArraySchema } from "./zod-types/toolModel.js";
import { sendAiMessage } from "./services/aiMessageService.js";
import { getToolCalls } from "./services/toolCallService.js";

const app = express();
// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/masteries/:licenseClass", jwtMiddleware, async (req, res, next) => {
  try {
    const { licenseClass } = req.params;
    const username = getEmailFromJWT(req.headers.authorization);
    if (!username) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const masteries = await getSubsectionMasteries(licenseClass, username);
    res.json(masteries);
  } catch (err) {
    next(err);
  }
});

app.get("/api/questions/:licenseClass/:subsectionCode", jwtMiddleware, async (req, res, next) => {
  try {
    const { subsectionCode } = req.params;
    const username = getEmailFromJWT(req.headers.authorization);
    if (!username) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const questions = await getQuestionsForSubsection(subsectionCode, username);
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

app.post("/api/answer", jwtMiddleware, async (req, res, next) => {
  try {
    const username = getEmailFromJWT(req.headers.authorization);
    if (!username) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const submission = AnswerSubmissionSchema.parse(req.body);
    await recordAnswer(username, submission);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.post("/api/ai/messages", jwtMiddleware, async (req, res, next) => {
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

app.get("/api/tool-calls", jwtMiddleware, async (req, res, next) => {
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

async function start() {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 4444;
  app.listen(port, () =>
    console.log(`API listening on port ${port}`)
  );
}

start().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});