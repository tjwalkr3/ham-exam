import express from "express";
import { jwtMiddleware } from "../middleware/authMiddleware.js";
import { getEmailFromJWT } from "../services/jwtHeaderService.js";
import { getQuestionsForSubsection, getSubsectionMasteries, recordAnswer } from "../services/databaseService.js";
import { AnswerSubmissionSchema } from "../zod-types/answerSubmissionModel.js";

const router = express.Router();

router.get("/masteries/:licenseClass", jwtMiddleware, async (req, res, next) => {
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

router.get("/questions/:licenseClass/:subsectionCode", jwtMiddleware, async (req, res, next) => {
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

router.post("/answer", jwtMiddleware, async (req, res, next) => {
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

export default router;
