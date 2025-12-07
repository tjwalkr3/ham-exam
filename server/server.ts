import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
import testRoutes from "./routes/testRoutes.js";

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

app.use("/api", testRoutes);
app.use("/api", aiRoutes);

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