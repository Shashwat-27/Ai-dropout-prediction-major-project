import express from "express";
import {
  upsertMentorInsight,
  getMentorInsights,
  getMentorInsightByAdmissionId,
} from "../controllers/mentorController.js";

const router = express.Router();

// GET /mentor/insights  → all insights
router.get("/", getMentorInsights);

// GET /mentor/insights/:id  → one student’s insight
router.get("/:id", getMentorInsightByAdmissionId);

// POST /mentor/insights  → create or update insight for a student
router.post("/", upsertMentorInsight);

export default router;
