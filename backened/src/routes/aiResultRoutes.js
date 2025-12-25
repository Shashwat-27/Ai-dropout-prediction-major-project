import express from "express";
import { analyzeStudent } from "../controllers/aiResultController.js";

const router = express.Router();

router.post("/analyze/:admission_id", analyzeStudent);

export default router;
