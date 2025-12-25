import prisma from "../config/prisma.js";

export const submitShortResponse = async (req, res) => {
  try {
    const { admission_id, short_response } = req.body;

     const studentExists = await prisma.student.findUnique({
      where: { admission_id },
    });

    if (!studentExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admission ID. Student not found.",
      });
    }

    if (!admission_id || !short_response) {
      return res.status(400).json({
        success: false,
        message: "Missing admission_id or short_response",
      });
    }

    const response = await prisma.studentShortResponse.upsert({
      where: { admission_id },

      create: {
        admission_id,
        instagram_id: short_response.instagram_id ?? null,
        snapchat_id: short_response.snapchat_id ?? null,
        study_source: short_response.study_source ?? null,
        time_preference: short_response.time_preference ?? null,
        personality_word: short_response.personality_word ?? null,
        friend_circle: short_response.friend_circle ?? null,
        has_best_friend: short_response.has_best_friend ?? null,
        problem_sharing: short_response.problem_sharing ?? null,
        support_seeking: short_response.support_seeking ?? null,
        group_vibe: short_response.group_vibe ?? null,
        favorite_social_app: short_response.favorite_social_app ?? null,
        drink_preference: short_response.drink_preference ?? null,
        today_mood: short_response.today_mood ?? null,
      },

      update: {
        instagram_id: short_response.instagram_id ?? null,
        snapchat_id: short_response.snapchat_id ?? null,
        study_source: short_response.study_source ?? null,
        time_preference: short_response.time_preference ?? null,
        personality_word: short_response.personality_word ?? null,
        friend_circle: short_response.friend_circle ?? null,
        has_best_friend: short_response.has_best_friend ?? null,
        problem_sharing: short_response.problem_sharing ?? null,
        support_seeking: short_response.support_seeking ?? null,
        group_vibe: short_response.group_vibe ?? null,
        favorite_social_app: short_response.favorite_social_app ?? null,
        drink_preference: short_response.drink_preference ?? null,
        today_mood: short_response.today_mood ?? null,
      },
    });

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (err) {
    console.error("SHORT RESPONSE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


export const submitTextResponse = async (req, res) => {
  try {
    const { admission_id, text_answer } = req.body;

    if (!admission_id || !text_answer) {
      return res.status(400).json({
        success: false,
        message: "Missing admission_id or text_response",
      });
    }

    const response = await prisma.studentTextAnswer.upsert({
      where: { admission_id },

      create: {
        admission_id,
        question1: text_answer.question1 ?? null,
        question2: text_answer.question2 ?? null,
        question3: text_answer.question3 ?? null,
        question4: text_answer.question4 ?? null,
        question5: text_answer.question5 ?? null,
        question6: text_answer.question6 ?? null,
        question7: text_answer.question7 ?? null,
        question8: text_answer.question8 ?? null,
      },

      update: {
        question1: text_answer.question1 ?? null,
        question2: text_answer.question2 ?? null,
        question3: text_answer.question3 ?? null,
        question4: text_answer.question4 ?? null,
        question5: text_answer.question5 ?? null,
        question6: text_answer.question6 ?? null,
        question7: text_answer.question7 ?? null,
        question8: text_answer.question8 ?? null,
      },
    });

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (err) {
    console.error("TEXT RESPONSE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// Optional: default export if you like
export default {
  submitShortResponse,
  submitTextResponse,
};
