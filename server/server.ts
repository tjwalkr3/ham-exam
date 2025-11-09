import "dotenv/config";
import express from "express";
import cors from "cors";
import pgPromise from "pg-promise";
import { getQuestionsForWeakestSubsection } from "./services/databaseService.js";

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

app.get("/api/questions/:licenseClass/:username", async (req, res, next) => {
  try {
    const { licenseClass, username } = req.params;
    const questions = await getQuestionsForWeakestSubsection(licenseClass, username);
    res.json(questions);
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