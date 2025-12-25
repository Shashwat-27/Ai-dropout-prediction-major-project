import express from "express";
import {
  submitShortResponse,
  submitTextResponse,
} from "../controllers/studedentResponseController.js";
import { submitVideoResponse } from "../controllers/videoResponseController.js";

const router = express.Router();

router.post("/short", submitShortResponse);
router.post("/text", submitTextResponse);
router.post("/video", submitVideoResponse);

export default router;
