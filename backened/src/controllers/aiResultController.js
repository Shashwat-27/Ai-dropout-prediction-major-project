import prisma from "../config/prisma.js";
import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;
export const analyzeStudent = async (req, res) => {
  try {
    const { admission_id } = req.params;

    // 1️⃣ Fetch student data
    const short = await prisma.studentShortResponse.findUnique({
      where: { admission_id },
    });

    const text = await prisma.studentTextAnswer.findUnique({
      where: { admission_id },
    });

    if (!text) {
      return res.status(404).json({
        success: false,
        message: "Text response not found",
      });
    }

    // 2️⃣ Combine all text answers
    const combinedText = Object.values(text)
      .filter((v) => typeof v === "string" && v.trim() !== "")
      .join(" ");

    // 3️⃣ Call NLP ML service (sentiment + emotion)
    const textML = await axios.post(
      `${ML_SERVICE_URL}/analyze-text`,
      { text: combinedText }
    );

    const {
      sentiment,
      sentiment_confidence,
      emotion,
      emotion_confidence,
    } = textML.data;

    // 4️⃣ Video emotion analysis (optional but included)
    let videoRisk = 0.2;
    let videoEmotion = "neutral";

    const video = await prisma.studentVideoResponse.findUnique({
      where: { admission_id },
    });

    if (video?.video_url) {
      const videoML = await axios.post(
        `${ML_SERVICE_URL}/analyze-video`,
        { video_url: video.video_url }
      );

      videoEmotion = videoML.data.video_emotion;

      if (["sad", "fear", "angry"].includes(videoEmotion)) {
        videoRisk = 0.6;
      }
    }

    // 5️⃣ Convert outputs into risk scores
    const textRisk =
      sentiment === "NEGATIVE" ? sentiment_confidence : 0.2;

    const shortRisk =
      short?.today_mood === "Not great" || short?.today_mood === "Terrible"
        ? 0.6
        : 0.3;

    // 6️⃣ Decision-level fusion (core logic)
    const finalRisk =
      0.5 * textRisk +
      0.2 * shortRisk +
      0.3 * videoRisk;

    let risk_level = "Low";
    let learning_phase = "Stable Phase";

    if (finalRisk >= 0.6) {
      risk_level = "High";
      learning_phase = "Academic Burnout";
    } else if (finalRisk >= 0.3) {
      risk_level = "Medium";
      learning_phase = "Struggling Phase";
    }

    // 7️⃣ Save final analysis
    const analysis = await prisma.studentAnalysis.upsert({
      where: { admission_id },
      create: {
        admission_id,
        sentiment,
        emotion,
        video_emotion: videoEmotion,
        risk_level,
        learning_phase,
        confidence_score: Number(finalRisk.toFixed(2)),
        explanation:
          "Decision-level fusion of pretrained NLP sentiment model, facial emotion analysis, and structured questionnaire responses",
      },
      update: {
        sentiment,
        emotion,
        video_emotion: videoEmotion,
        risk_level,
        learning_phase,
        confidence_score: Number(finalRisk.toFixed(2)),
        explanation:
          "Updated using decision-level fusion of text, video, and form-based signals",
      },
    });

    // 8️⃣ Final response
    res.json({
      success: true,
      analysis,
    });

  } catch (err) {
    console.error("AI ANALYSIS ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
