import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

/* ================= STUDENT LOGIN ================= */
export const studentLogin = async (req, res) => {
  try {
    const { admission_id, dob } = req.body;

    if (!admission_id || !dob) {
      return res.status(400).json({
        success: false,
        message: "Admission ID and DOB required",
      });
    }

    const inputDate = new Date(dob);

    const start = new Date(inputDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(inputDate);
    end.setHours(23, 59, 59, 999);

    const student = await prisma.student.findFirst({
      where: {
        admission_id,
        dob: {
          gte: start,
          lte: end,
        },
      },
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admission ID or DOB",
      });
    }

    res.json({
      success: true,
      role: "Student",
      admission_id: student.admission_id,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= MENTOR LOGIN ================= */
export const mentorLogin = async (req, res) => {
  try {
    const { mentor_id, password } = req.body;

    console.log("LOGIN INPUT:", mentor_id, password);

    const mentor = await prisma.mentor.findUnique({
      where: { mentor_id },
    });

    console.log("MENTOR FROM DB:", mentor);

    // 🔴 FIRST CHECK: mentor exists or not
    if (!mentor) {
      console.log("❌ Mentor not found");
      return res.status(401).json({
        success: false,
        message: "Invalid Mentor credentials",
      });
    }

    console.log("HASH FROM DB:", mentor.password);
    console.log("HASH LENGTH:", mentor.password.length);

    const match = await bcrypt.compare(password, mentor.password);
    console.log("PASSWORD MATCH:", match);

    if (!match) {
      console.log("❌ Password mismatch");
      return res.status(401).json({
        success: false,
        message: "Invalid Mentor credentials",
      });
    }

    // ✅ SUCCESS
    res.json({
      success: true,
      role: "Mentor",
      mentor_id: mentor.mentor_id,
    });

  } catch (err) {
    console.error("MENTOR LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


/* ================= PSYCHOLOGIST LOGIN ================= */
export const psychologistLogin = async (req, res) => {
  try {
    const { psych_id, password } = req.body;

    const psychologist = await prisma.psychologist.findUnique({
      where: { psych_id },
    });

    if (
      !psychologist ||
      !(await bcrypt.compare(password, psychologist.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Psychologist credentials",
      });
    }

    res.json({ success: true, role: "Psychologist" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================= ADMIN LOGIN ================= */
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    return res.json({ success: true, role: "Admin" });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid Admin credentials",
  });
};
