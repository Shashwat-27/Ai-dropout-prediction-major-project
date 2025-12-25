from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from deepface import DeepFace
import cv2
import tempfile
import requests
import numpy as np

app = FastAPI()

sentiment_model = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

class TextInput(BaseModel):
    text: str

@app.post("/analyze-text")
def analyze_text(data: TextInput):
    sentiment = sentiment_model(data.text)[0]
    emotion = emotion_model(data.text)[0][0]

    return {
        "sentiment": sentiment["label"],
        "sentiment_confidence": round(sentiment["score"], 3),
        "emotion": emotion["label"],
        "emotion_confidence": round(emotion["score"], 3)
    }


# ---------- VIDEO / FACE ANALYSIS ----------
class VideoInput(BaseModel):
    video_url: str

@app.post("/analyze-video")
def analyze_video(data: VideoInput):
    try:
        # download video temporarily
        video_bytes = requests.get(data.video_url).content
        with tempfile.NamedTemporaryFile(suffix=".mp4") as tmp:
            tmp.write(video_bytes)
            tmp.flush()

            cap = cv2.VideoCapture(tmp.name)
            ret, frame = cap.read()
            cap.release()

        if not ret:
            return {"error": "Unable to read video frame"}

        result = DeepFace.analyze(
            frame,
            actions=["emotion"],
            enforce_detection=False
        )

        emotion = result[0]["dominant_emotion"]
        confidence = result[0]["emotion"][emotion]

        return {
            "video_emotion": emotion,
            "video_confidence": round(float(confidence), 3)
        }

    except Exception as e:
        return {"error": str(e)}
# To run the app: uvicorn aiprediction.ml_service.app:app --reload