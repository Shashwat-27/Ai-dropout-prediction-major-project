import express from "express";
import {
  studentLogin,
  mentorLogin,
  psychologistLogin,
  adminLogin
} from "../controllers/authController.js";

const router = express.Router();

router.post("/student-login", studentLogin);
router.post("/mentor-login", mentorLogin);
router.post("/psychologist-login", psychologistLogin);
router.post("/admin-login", adminLogin);

export default router;
