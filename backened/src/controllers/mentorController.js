// controllers/mentorController.js
import prisma from "../config/prisma.js";

// 🟩 CREATE / UPDATE Mentor Insight (Upsert)
export const upsertMentorInsight = async (req, res) => {
  try {
    const {
      admission_id,
      mentor_review_notes,
      mentor_recommendation_action,
      mentor_custom_action_plan,
      reviewed_by_mentor,
    } = req.body;

    if (!admission_id) {
      return res.status(400).json({ error: "admission_id is required" });
    }

    const insight = await prisma.mentorInsight.upsert({
      where: { admission_id },
      create: {admission_id,
        mentor_review_notes,
        mentor_recommendation_action,
        mentor_custom_action_plan,
        reviewed_by_mentor: Boolean(reviewed_by_mentor),},
      update: {mentor_review_notes,
        mentor_recommendation_action,
        mentor_custom_action_plan,
        reviewed_by_mentor: Boolean(reviewed_by_mentor),
        last_updated: new Date(),
      },
    });

    res.json(insight);
  } catch (error) {
    console.error("Error in upsertMentorInsight:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟦 READ All Mentor Insights
export const getMentorInsights = async (req, res) => {
  try {
    const insights = await prisma.mentorInsight.findMany({
      include: { student: true }, // so mentor sees basic student info too
    });
    res.json(insights);
  } catch (error) {
    console.error("Error in getMentorInsights:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟨 (Optional) Get insight for one student
export const getMentorInsightByAdmissionId = async (req, res) => {
  try {
    const { id } = req.params;
    const insight = await prisma.mentorInsight.findUnique({
      where: { admission_id: id },
      include: { student: true },
    });

    if (!insight) {
      return res.status(404).json({ error: "Mentor insight not found" });
    }

    res.json(insight);
  } catch (error) {
    console.error("Error in getMentorInsightByAdmissionId:", error);
    res.status(500).json({ error: error.message });
  }
};

export default ({
  upsertMentorInsight,
  getMentorInsights,
  getMentorInsightByAdmissionId,
});
