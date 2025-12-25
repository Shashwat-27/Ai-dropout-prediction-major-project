import express from "express";
import {
  upsertPsychologistReview,
  getPsychologistReviews,
  getPsychologistReviewByAdmissionId,
} from "../controllers/psycologistController.js";

const router = express.Router();

// CREATE / UPDATE
router.post("/", upsertPsychologistReview);

// READ all
router.get("/", getPsychologistReviews);

// READ one by admission_id
router.get("/:admission_id", getPsychologistReviewByAdmissionId);

export default router;
