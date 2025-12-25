import prisma from "../config/prisma.js";

/**
 * 🟩 CREATE / UPDATE Psychologist Review (UPSERT)
 * POST /api/psychologist-reviews
 */
export const upsertPsychologistReview = async (req, res) => {
  try {
    const {
      admission_id,
      stability,
      anxiety_level,
      coping_mechanisms,
      academic_impact,
      observation,
      psychologist_recommendation_action,
      psychologist_name,
      reviewed_by_psychologist,
      review_date,
    } = req.body;

    if (!admission_id) {
      return res.status(400).json({ error: "admission_id is required" });
    }

    const review = await prisma.psychologistReview.upsert({
      where: { admission_id },
      create: {
        admission_id,
        stability,
        anxiety_level,
        coping_mechanisms,
        academic_impact,
        observation,
        psychologist_recommendation_action,
        psychologist_name,
        reviewed_by_psychologist: Boolean(reviewed_by_psychologist),
        review_date: new Date(review_date),
      },
      update: {
        stability,
        anxiety_level,
        coping_mechanisms,
        academic_impact,
        observation,
        psychologist_recommendation_action,
        psychologist_name,
        reviewed_by_psychologist: Boolean(reviewed_by_psychologist),
        review_date: new Date(review_date),
        
      },
    });

    res.json(review);
  } catch (error) {
    console.error("Error upserting psychologist review:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🟦 GET ALL Psychologist Reviews (with student info)
 * GET /api/psychologist-reviews
 */
export const getPsychologistReviews = async (req, res) => {
  try {
    const reviews = await prisma.psychologistReview.findMany({
      include: {
        student: {
          select: {
            admission_id: true,
            name: true,
            department: true,
            year: true,
          },
        },
      },
      orderBy: { last_updated: "desc" },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching psychologist reviews:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🟨 GET Review for ONE Student
 * GET /api/psychologist-reviews/:admission_id
 */
export const getPsychologistReviewByAdmissionId = async (req, res) => {
  try {
    const { admission_id } = req.params;

    const review = await prisma.psychologistReview.findUnique({
      where: { admission_id },
      include: { student: true },
    });

    if (!review) {
      return res.status(404).json({ error: "Psychologist review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching psychologist review:", error);
    res.status(500).json({ error: error.message });
  }
};
