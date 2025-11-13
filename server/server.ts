import "dotenv/config";
import express from "express";
import cors from "cors";
import pgPromise from "pg-promise";
import { getQuestionsForWeakestSubsection, getSubsectionMasteries, getQuestionsForSubsection, recordAnswer } from "./services/databaseService.js";
import { jwtMiddleware } from "./middleware/authMiddleware.js";
import { getEmailFromJWT } from "./services/jwtHeaderService.js";
import { AnswerSubmissionSchema } from "./zod-types/answerSubmissionModel.js";

const pgp = pgPromise({});
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
export const db = pgp(connectionString);

const app = express();
app.use(cors());
app.use(express.json());

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

app.get("/api/questions/:licenseClass", jwtMiddleware, async (req, res, next) => {
  try {
    const { licenseClass } = req.params;
    const username = getEmailFromJWT(req.headers.authorization);
    if (!username) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const questions = await getQuestionsForWeakestSubsection(licenseClass, username);
    res.json(questions);
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