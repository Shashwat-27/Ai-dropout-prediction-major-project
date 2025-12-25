import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./src/routes/authRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import mentorRoutes from "./src/routes/mentorRoutes.js";
import aiResultRoutes from "./src/routes/aiResultRoutes.js";
import psycologistRoutes from "./src/routes/psycologistRoutes.js";
import studentResponseRoutes from "./src/routes/studentResponseRoute.js";
dotenv.config();

const app=express();

const prisma= new PrismaClient();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/students",studentRoutes);
app.use("/api/mentor-insights",mentorRoutes);
app.use("/api/ai-results",aiResultRoutes);
app.use("/api/psycologist",psycologistRoutes);
app.use("/api/student-response",studentResponseRoutes);


// 🧩 Test Route
app.get("/", (req, res) => {
  res.send(" Dropout Prediction Backend running successfully!");
});


app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


