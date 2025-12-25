import prisma from "../config/prisma.js";

export const submitVideoResponse = async (req, res) => {
  try {
    const { admission_id, video_url } = req.body;

    if (!admission_id || !video_url) {
      return res.status(400).json({
        success: false,
        message: "Missing admission_id or video_url",
      });
    }

    if (video_url.includes("/upload/") && !video_url.includes("f_mp4")) {
      video_url = video_url.replace("/upload/", "/upload/f_mp4/");
    }

    const video = await prisma.studentVideoResponse.upsert({
      where: { admission_id },
      create: {
        admission_id,
        video_url,
      },
      update: {
        video_url,
      },
    });

    // ✅ THIS IS THE FIX
    res.status(200).json({
      success: true,
      data: video,
    });

  } catch (err) {
    console.error("VIDEO RESPONSE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
