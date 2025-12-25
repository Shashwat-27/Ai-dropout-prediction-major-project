import { useState, useRef, useEffect } from "react";

import axios from "axios";
import { API_URL } from "../../api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ProgressBar,
  Alert,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../../state/AuthContext";

function StudentPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Form data state
  const [formData, setFormData] = useState({
    admissionId:"",
    instagramId: "",
    snapchatId: "",
    studySource: "",
    timePreference: "",
    personalityWord: "",
    friendCircle: "",
    hasBestFriend: "",
    problemSharing: "",
    supportSeeking: "",
    groupVibe: "",
    favoriteSocialApp: "",
    drinkPreference: "",
    todayMood: "",
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
  });

  const steps = [
    {
      number: 1,
      title: "Social & Personality",
      description: "Tell us about yourself",
    },
    { number: 2, title: "Text Questions", description: "Share your thoughts" },
    { number: 3, title: "Video Response", description: "Record your response" },
  ];

  const questions = [
    {
      id: "question1",
      text: "When was the last time you felt proud of yourself in college? What happened?",
      placeholder:
        "For example: ‘Last month I presented my project and my teacher appreciated it. It made me feel confident that I can actually do well.’ Describe that moment in your own words",
    },
    {
      id: "question2",
      text: "What makes you feel disconnected or tired of studying these days?",
      placeholder:
        "You might say: ‘Sometimes I study for hours but feel it’s useless.’ or ‘I get distracted easily and don’t feel motivated anymore.’ Be completely honest here — no judgment.",
    },
    {
      id: "question3",
      text: "If you could change one thing about your college experience, what would it be and why?",
      placeholder:
        "It could be about teachers, schedule, friends, or even yourself. For example: ‘I wish teachers talked more practically’ or ‘I wish I had more supportive classmates.’ Explain your reason",
    },
    {
      id: "question4",
      text: "Who or what do you turn to when you feel emotionally low or anxious?",
      placeholder:
        "You can say: ‘I usually call my best friend,’ or ‘I don’t really talk to anyone; I just sleep.’ Be real — this helps us understand your support circle.",
    },
    {
      id: "question5",
      text: "Describe a moment recently when you felt completely lost, demotivated, or invisible.",
      placeholder:
        "Maybe a time when you failed a test, got ignored by friends, or felt like you don’t belong. Tell how that felt — not just what happened.",
    },
    {
      id: "question6",
      text: "What’s one small thing that keeps you going, even when things are hard?",
      placeholder:
        "It could be anything — your dream job, a friend, your parents’ belief in you, music, or even a quote. Example: ‘Whenever I feel down, I remember why I started.’ Write yours.",
    },
    {
      id: "question7",
      text: "How do you usually react when you fail or get low marks?",
      placeholder:
        "Example: ‘I feel bad and stop studying for a few days,’ or ‘I try to understand my mistake and improve.’ Describe what really happens to you.",
    },
    {
      id: "question8",
      text: "What’s something you wish your teachers or mentors understood about you?",
      placeholder:
        "Example: ‘I wish they knew that I try my best even when I’m quiet,’ or ‘I wish they saw I’m struggling silently.’ Say what you truly feel unseen about.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedVideo(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
   
 const convertCloudinaryToMP4 = (url) => {
  if (!url || !url.includes("/upload/")) return url;
  if (url.includes("f_mp4")) return url; // already converted
  return url.replace("/upload/", "/upload/f_mp4/");
};


  
  const handleSubmit = async () => {
    if(submitting) return; // prevent multiple submissions

    if(!formData.admissionId){
      alert("Please enter your Admission Id before submitting.");
      return;
    }
    if(!recordedVideo){
      alert("Please record your video response before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      
  
   const shortRes = await axios.post(`${API_URL}/api/student-response/short`, {
  admission_id: formData.admissionId,

  short_response: {
    instagram_id: formData.instagramId,
    snapchat_id: formData.snapchatId,
    study_source: formData.studySource,
    time_preference: formData.timePreference,
    personality_word: formData.personalityWord,
    friend_circle: formData.friendCircle,
    has_best_friend: formData.hasBestFriend,
    problem_sharing: formData.problemSharing,
    support_seeking: formData.supportSeeking,
    group_vibe: formData.groupVibe,
    favorite_social_app: formData.favoriteSocialApp,
    drink_preference: formData.drinkPreference,
    today_mood: formData.todayMood,
  },

 
});


console.log("SHORT API RESPONSE:", shortRes.data);

    // ❌ DO NOT PROCEED IF BACKEND FAILED
    if (!shortRes.data?.success) {
      throw new Error("Short response not saved in DB");
    }

   const textRes = await axios.post(
      `${API_URL}/api/student-response/text`,
      {
        admission_id: formData.admissionId,
        text_answer: {
          question1: formData.question1,
          question2: formData.question2,
          question3: formData.question3,
          question4: formData.question4,
          question5: formData.question5,
          question6: formData.question6,
          question7: formData.question7,
          question8: formData.question8,
        },
      }
    );

    if (!textRes.data?.success) {
      throw new Error("Text response not saved");
    }

  // upload video to cloudinary
   const data = new FormData();
    data.append("file", recordedVideo);
    data.append("upload_preset", "student_videos");

    const cloudRes = await fetch(
      "https://api.cloudinary.com/v1_1/dtfrfuzcf/video/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const cloudResult = await cloudRes.json();

    console.log("CLOUDINARY RESPONSE:", cloudResult);

    if (!cloudResult.secure_url) {
      throw new Error("Video upload failed");
    }

    // save video URL in backend

   const mp4VideoUrl = convertCloudinaryToMP4(cloudResult.secure_url); 

   const videoRes = await axios.post(
      `${API_URL}/api/student-response/video`,
      {
        admission_id: formData.admissionId,
        video_url: mp4VideoUrl,
      }
    );

    console.log("VIDEO API RESPONSE:", videoRes.data);

    if (!videoRes.data?.success) {
      throw new Error("Video URL not saved in DB");
    }

  // success
  
      alert('All responses submitted successfully!');
      setShowSuccess(true);
  
    } catch (err) {
    console.error("SUBMISSION ERROR:", err);

    alert(
      err?.response?.data?.message ||
      err.message ||
      "Error submitting data. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};
  

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      admissionId:"",
      instagramId: "",
      snapchatId: "",
      studySource: "",
      timePreference: "",
      personalityWord: "",
      friendCircle: "",
      hasBestFriend: "",
      problemSharing: "",
      supportSeeking: "",
      groupVibe: "",
      favoriteSocialApp: "",
      drinkPreference: "",
      todayMood: "",
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      question5: "",
      question6: "",
      question7: "",
      question8: "",
    });
    setRecordedVideo(null);
    setRecordingTime(0);
    setShowSuccess(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E8F0FE 0%, #F5F7FB 100%)",
        minHeight: "100vh",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Container className="py-5">
        {/* Hero Section */}
        <Row className="text-center mb-5">
          <Col>
            <div className="mb-4">
              <span className="badge bg-primary px-3 py-2 mb-3" style={{ fontSize: '16px', borderRadius: '20px' }}>
                🎯 Quick & Fun Assessment
              </span>
            </div>
            <h1 className="display-4 fw-bold mb-4" style={{ 
              color: "#1e293b",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Hey there! 👋 Let's get to know you better
            </h1>
            <p className="lead mb-4" style={{ color: "#64748b", fontSize: "1.3rem" }}>
              We're building something amazing together! Your answers help us create a 
              <span className="fw-semibold text-primary"> personalized learning experience</span> 
              that's just right for you. No pressure, just be yourself! ✨
            </p>
            <div className="d-flex justify-content-center gap-4 mb-4">
              <div className="text-center">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 50, height: 50 }}>
                  <span style={{ fontSize: '20px' }}>🔒</span>
                </div>
                <small className="text-muted">100% Private</small>
              </div>
              <div className="text-center">
                <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 50, height: 50 }}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                </div>
                <small className="text-muted">Takes 5 mins</small>
              </div>
              <div className="text-center">
                <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 50, height: 50 }}>
                  <span style={{ fontSize: '20px' }}>🎁</span>
                </div>
                <small className="text-muted">Get insights</small>
              </div>
            </div>
          </Col>
        </Row>

        {/* Progress Bar */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <h6 className="text-muted mb-0">Your Journey So Far</h6>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {steps.map((step, index) => (
                    <div key={step.number} className="text-center flex-fill position-relative">
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow-sm ${
                          currentStep >= step.number
                            ? "bg-primary text-white"
                            : currentStep === step.number
                            ? "bg-warning text-white"
                            : "bg-light text-muted"
                        }`}
                        style={{ 
                          width: 50, 
                          height: 50,
                          fontSize: '18px',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {currentStep > step.number ? '✓' : step.number}
                      </div>
                      <div
                        className="small fw-semibold"
                        style={{
                          color: currentStep >= step.number ? "#3b82f6" : "#94a3b8",
                        }}
                      >
                        {step.title}
                      </div>
                      <div className="small text-muted">{step.description}</div>
                    </div>
                  ))}
                </div>
                <ProgressBar
                  now={(currentStep / 3) * 100}
                  style={{ height: "8px" }}
                  className="rounded-pill"
                  variant="primary"
                />
                <div className="text-center mt-2">
                  <small className="text-muted">
                    {currentStep === 1 && "Let's start with some fun questions about you! 🎉"}
                    {currentStep === 2 && "Great! Now let's dive deeper into your thoughts 💭"}
                    {currentStep === 3 && "Almost done! Just a quick video and we're all set! 🎥"}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Step Content */}
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Step 1: Social & Personality Questions */}
            {currentStep === 1 && (
              <Card className="border-0 shadow-lg" style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px solid #e2e8f0'
              }}>
                <Card.Body className="p-5">
                  <div className="text-center mb-5">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                      <span style={{ fontSize: '32px' }}>🎭</span>
                    </div>
                    <h3 className="mb-3" style={{ color: "#1e293b" }}>
                      Let's Chat About You! 💬
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                      Think of this as a friendly conversation! We're curious about your world - 
                      your social life, how you learn, and what makes you tick. 
                      <span className="fw-semibold text-primary"> There are no wrong answers!</span> 🌟
                    </p>
                  </div>
                  
                  <Row className="g-4">
                    {/* Social Media Questions */}
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #f59e0b' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">📸</span>
                          Admission Id 
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="admissionId"
                          value={formData.admissionId}
                          onChange={handleInputChange}
                          placeholder="2023b1541048"
                          className="border-0 rounded-pill px-4 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.9)' }}
                        />
                        {/* <small className="text-muted">We love seeing your creative side! ✨</small> */}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #f59e0b' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">📸</span>
                          What's your Instagram handle? 
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="instagramId"
                          value={formData.instagramId}
                          onChange={handleInputChange}
                          placeholder="@yourusername"
                          className="border-0 rounded-pill px-4 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.9)' }}
                        />
                        <small className="text-muted">We love seeing your creative side! ✨</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '1px solid #3b82f6' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">💬</span>
                          Snapchat or X (Twitter) handle?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="snapchatId"
                          value={formData.snapchatId}
                          onChange={handleInputChange}
                          placeholder="@snap_it"
                          className="border-0 rounded-pill px-4 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.9)' }}
                        />
                        <small className="text-muted">Your social vibe matters to us! 🌟</small>
                      </div>
                    </Col>

                    {/* Learning & Study Habits */}
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #10b981' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">📚</span>
                          Where do you usually study from?
                        </Form.Label>
                        <Form.Select
                          name="studySource"
                          value={formData.studySource}
                          onChange={handleInputChange}
                          className="border-0 rounded-pill px-3 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                        >
                          <option value="">Choose your learning style...</option>
                          <option value="YouTube">🎥 YouTube (Visual learner)</option>
                          <option value="Notes">📝 Notes (Traditional)</option>
                          <option value="Coaching">👨‍🏫 Coaching (Guided)</option>
                          <option value="Friends">👥 Friends (Group study)</option>
                        </Form.Select>
                        <small className="text-muted">Everyone learns differently! 🧠</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #f59e0b' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">🌅🌙</span>
                          Are you a morning or night person?
                        </Form.Label>
                        <div className="d-flex gap-3 align-items-center flex-wrap">
                          <input type="radio" className="btn-check" name="timePreference" id="tp-morning" value="Morning" checked={formData.timePreference === 'Morning'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="tp-morning">🌅 Morning Bird</label>
                          <input type="radio" className="btn-check" name="timePreference" id="tp-night" value="Night" checked={formData.timePreference === 'Night'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="tp-night">🌙 Night Owl</label>
                        </div>
                        <small className="text-muted">When do you feel most productive? ⚡</small>
                      </div>
                    </Col>

                    {/* Personality Questions */}
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '1px solid #ec4899' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">😎</span>
                          One word that describes you best
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="personalityWord"
                          value={formData.personalityWord}
                          onChange={handleInputChange}
                          placeholder="Curious / Chill / Dreamer / Adventurous..."
                          className="border-0 rounded-pill px-4 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.9)' }}
                        />
                        <small className="text-muted">What's your superpower? 🦸‍♀️</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '1px solid #6366f1' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">👥</span>
                          Your social style?
                        </Form.Label>
                        <div className="d-flex gap-3 align-items-center flex-wrap">
                          <input type="radio" className="btn-check" name="friendCircle" id="fc-many" value="Many" checked={formData.friendCircle === 'Many'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="fc-many">🎉 Many friends</label>
                          <input type="radio" className="btn-check" name="friendCircle" id="fc-few" value="Few" checked={formData.friendCircle === 'Few'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="fc-few">💎 Few close ones</label>
                        </div>
                        <small className="text-muted">Both are awesome! 🌟</small>
                      </div>
                    </Col>

                    {/* Social Support Questions */}
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)', border: '1px solid #8b5cf6' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">❤️</span>
                          Do you have a best friend in college?
                        </Form.Label>
                        <div className="d-flex gap-3 align-items-center flex-wrap">
                          <input type="radio" className="btn-check" name="hasBestFriend" id="bf-yes" value="Yes" checked={formData.hasBestFriend === 'Yes'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="bf-yes">Yes</label>
                          <input type="radio" className="btn-check" name="hasBestFriend" id="bf-no" value="No" checked={formData.hasBestFriend === 'No'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="bf-no">No</label>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '1px solid #38bdf8' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">🤝</span>
                          How often do you talk to your friends about problems?
                        </Form.Label>
                        <Form.Select
                          name="problemSharing"
                          value={formData.problemSharing}
                          onChange={handleInputChange}
                          className="border-0 rounded-pill px-3 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                        >
                          <option value="">Pick what feels right...</option>
                          <option value="Always">Always</option>
                          <option value="Sometimes">Sometimes</option>
                          <option value="Rarely">Rarely</option>
                        </Form.Select>
                      </div>
                    </Col>

                    {/* Coping & Support */}
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', border: '1px solid #fb7185' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">😔</span>
                          Who do you go to first when you feel low?
                        </Form.Label>
                        <Form.Select
                          name="supportSeeking"
                          value={formData.supportSeeking}
                          onChange={handleInputChange}
                          className="border-0 rounded-pill px-3 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                        >
                          <option value="">Choose your comfort...</option>
                          <option value="Friend">Friend</option>
                          <option value="Family">Family</option>
                          <option value="Alone">Alone</option>
                        </Form.Select>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)', border: '1px solid #a8a29e' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">🔥</span>
                          Your group vibe in one word?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="groupVibe"
                          value={formData.groupVibe}
                          onChange={handleInputChange}
                          placeholder="Chill / Serious / Fun / Supportive"
                          className="border-0 rounded-pill px-4 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                        />
                      </div>
                    </Col>

                    {/* Lifestyle & Preferences */}
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '1px solid #6366f1' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">📱</span>
                          What's your favorite social app?
                        </Form.Label>
                        <Form.Select
                          name="favoriteSocialApp"
                          value={formData.favoriteSocialApp}
                          onChange={handleInputChange}
                          className="border-0 rounded-pill px-3 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                        >
                          <option value="">Pick your go-to...</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Reddit">Reddit</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Twitter">Twitter</option>
                        </Form.Select>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', border: '1px solid #14b8a6' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">☕</span>
                          Coffee or Tea person?
                        </Form.Label>
                        <div className="d-flex gap-3 align-items-center flex-wrap">
                          <input type="radio" className="btn-check" name="drinkPreference" id="dp-coffee" value="Coffee" checked={formData.drinkPreference === 'Coffee'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="dp-coffee">Coffee</label>
                          <input type="radio" className="btn-check" name="drinkPreference" id="dp-tea" value="Tea" checked={formData.drinkPreference === 'Tea'} onChange={handleInputChange} />
                          <label className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm" htmlFor="dp-tea">Tea</label>
                        </div>
                      </div>
                    </Col>

                    {/* Mood Question */}
                    <Col md={6}>
                      <div className="p-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #38bdf8' }}>
                        <Form.Label className="fw-semibold d-flex align-items-center mb-2">
                          <span className="me-2">😊</span>
                          How's your mood today?
                        </Form.Label>
                        <Form.Select
                          name="todayMood"
                          value={formData.todayMood}
                          onChange={handleInputChange}
                          className="border-0 rounded-pill px-3 py-2 shadow-sm"
                          style={{ background: 'rgba(255,255,255,0.95)' }}
                        >
                          <option value="">Select your mood</option>
                          <option value="Excellent">Excellent 😄</option>
                          <option value="Good">Good 😊</option>
                          <option value="Okay">Okay 😐</option>
                          <option value="Not great">Not great 😔</option>
                          <option value="Terrible">Terrible 😢</option>
                        </Form.Select>
                      </div>
                    </Col>
                  </Row>
                  
                  <div className="text-center mt-5">
                    <div className="mb-3">
                      <span className="badge bg-success px-3 py-2" style={{ fontSize: '14px' }}>
                        ✨ You're doing great! Keep going!
                      </span>
                    </div>
                    <Button
                      onClick={nextStep}
                      size="lg"
                      className="px-5 py-3 rounded-pill shadow"
                      style={{ 
                        backgroundColor: "#3b82f6", 
                        border: "none",
                        fontSize: "18px",
                        fontWeight: "600",
                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                      }}
                    >
                      Continue the Journey 🚀
                    </Button>
                    <p className="text-muted mt-3 mb-0">
                      Don't worry, you can always go back and change your answers! 😊
                    </p>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Text Questions */}
            {currentStep === 2 && (
              <Card className="border-0 shadow-lg" style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px solid #e2e8f0'
              }}>
                <Card.Body className="p-5">
                  <div className="text-center mb-5">
                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                      <span style={{ fontSize: '32px' }}>💭</span>
                    </div>
                    <h3 className="mb-3" style={{ color: "#1e293b" }}>
                      Time to Share Your Story! 📝
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                      Now we want to hear your thoughts! These questions help us understand 
                      your experiences and feelings. 
                      <span className="fw-semibold text-primary"> Be as honest as you want to be!</span> 🌈
                    </p>
                  </div>

                  {questions.map((question, index) => (
                    <div key={question.id} className="mb-4">
                      <div className="p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #f9fafb 100%)', border: '1px solid #e5e7eb' }}>
                        <Form.Label
                          className="fw-semibold mb-2 d-flex align-items-start"
                          style={{ color: "#111827", fontSize: '1.02rem' }}
                        >
                          <span className="me-2 badge bg-primary-subtle text-primary border rounded-pill px-3">{index + 1}</span>
                          <span>{question.text}</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name={question.id}
                          value={formData[question.id]}
                          onChange={handleInputChange}
                          placeholder={question.placeholder}
                          rows={5}
                          maxLength={500}
                          className="rounded-4 border-0 shadow-sm"
                          style={{ resize: 'vertical', background: '#ffffff', padding: '14px 16px' }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className="text-muted">Share as much as you like — it's a safe space 💬</small>
                          <small className="text-muted">{formData[question.id].length}/500</small>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <Button
                      variant="outline-secondary"
                      onClick={prevStep}
                      className="px-4 rounded-pill shadow-sm"
                    >
                      ← Back
                    </Button>
                    <div className="text-center flex-grow-1">
                      <small className="text-muted">You're almost there. Your voice matters! 🌟</small>
                    </div>
                    <Button
                      onClick={nextStep}
                      disabled={
                        !formData.question1 ||
                        !formData.question2 ||
                        !formData.question3 ||
                        !formData.question4 ||
                        !formData.question5 ||
                        !formData.question6 ||
                        !formData.question7 ||
                        !formData.question8
                      }
                      className="px-5 py-2 rounded-pill shadow"
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', border: 'none', fontWeight: 600 }}
                    >
                      Continue →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 3: Video Recording */}
            {currentStep === 3 && (
              <Card className="border-0 shadow-lg" style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px solid #e2e8f0'
              }}>
                <Card.Body className="p-5">
                  <div className="text-center mb-5">
                    <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                      <span style={{ fontSize: '32px' }}>🎥</span>
                    </div>
                    <h3 className="mb-3" style={{ color: "#1e293b" }}>
                      Last Step - Let's See Your Beautiful Face! 😊
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                      We'd love to hear your voice! Just talk naturally about: 
                      <span className="fw-semibold text-primary"> "How are you feeling about your college life and learning journey recently?"</span>
                      <br />
                      <small className="text-muted">Don't worry about being perfect - just be you! 🌟</small>
                    </p>
                  </div>

                  <div className="text-center mb-4">
                    <div
                      className="bg-light rounded-3 p-4 mb-3"
                      style={{ minHeight: "300px" }}
                    >
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-100 h-100"
                        style={{
                          maxHeight: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      {!videoRef.current?.srcObject && (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <div className="text-center">
                            <div className="mb-3" style={{ fontSize: "48px" }}>
                              📹
                            </div>
                            <p className="text-muted">
                              Camera preview will appear here
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      {isRecording && (
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div
                            className="bg-danger rounded-circle"
                            style={{ width: "12px", height: "12px" }}
                          ></div>
                          <span className="fw-semibold text-danger">
                            Recording: {formatTime(recordingTime)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                      {!isRecording ? (
                        <Button
                          onClick={startRecording}
                          className="px-4"
                          style={{ backgroundColor: "#10b981", border: "none" }}
                        >
                          🎥 Start Recording
                        </Button>
                      ) : (
                        <Button
                          onClick={stopRecording}
                          variant="danger"
                          className="px-4"
                        >
                          ⏹️ Stop Recording
                        </Button>
                      )}
                    </div>

                    {recordedVideo && (
                      <div className="mt-4">
                        <Alert
                          variant="success"
                          className="d-flex align-items-center justify-content-between"
                        >
                          <span>✅ Video recorded successfully!</span>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => {
                              setRecordedVideo(null);
                              setRecordingTime(0);
                            }}
                          >
                            Re-record
                          </Button>
                        </Alert>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="outline-secondary"
                      onClick={prevStep}
                      className="px-4"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!recordedVideo || submitting}
                      className="px-5 py-2 rounded-pill shadow"
                      style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', border: 'none', fontWeight: 600 }}
                    >
                      {submitting ? 'Submitting…' : 'Submit Response'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={() => {}} centered>
        <Modal.Body className="text-center p-5">
          <div className="mb-4">
            <div
              className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 80, height: 80 }}
            >
              <span style={{ fontSize: "32px" }}>✅</span>
            </div>
            <h3 className="mb-3" style={{ color: "#1e293b" }}>
              Thank You!
            </h3>
            <p className="text-muted mb-4">
              Your responses have been securely recorded. Our AI will analyze
              your data and share results soon.
            </p>
          </div>
          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="outline-primary"
              onClick={resetForm}
              className="px-4"
            >
              Take Another Assessment
            </Button>
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-4"
              style={{ backgroundColor: "#3b82f6", border: "none" }}
            >
              Return to Dashboard
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default StudentPage;
