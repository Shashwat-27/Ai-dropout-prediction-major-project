import prisma from "../config/prisma.js";

// CREATE student
export const createStudent = async (req, res) => {
  try {
    const data = req.body;
    const student = await prisma.student.create({ data:{
      ...data,

        // ✅ FIX DateTime fields
        dob: data.dob ? new Date(data.dob) : null,
        enrollmentDate: data.enrollmentDate
          ? new Date(data.enrollmentDate)
          : null
    } });
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: error.message });
  }
};

// READ all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        mentor_insight: true,
        StudentAnalysis: true,
        psychologist_review: true,
        short_response: true,
        text_answer: true,
        video_response: true,
      },
    });
    res.json(students);
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({ error: error.message });
  }
};

// READ student by ID (admission_id)
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { admission_id: id },
      include: {
        mentor_insight: true,
        ai_result: true,
        psychologist_review: true,
        short_response: true,
        text_answer: true,
        video_response: true,
      },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    console.error("Error getting student by id:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.student.update({
      where: { admission_id: id },
      data:{
        ...data,
        dob:
          data.dob !== undefined && data.dob !== ""
            ? new Date(data.dob)
            : undefined,

        enrollmentDate:
          data.enrollmentDate !== undefined && data.enrollmentDate !== ""
            ? new Date(data.enrollmentDate)
            : undefined,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { admission_id: id } });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: error.message });
  }
};

// Optional: default export if you like
export default {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
