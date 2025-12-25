import { useMemo, useState, useEffect } from "react";

import axios from "axios";
import { API_URL } from "../../api";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
  Badge,
  Alert,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function RiskBadge({ level }) {
  const variant =
    level === "High" ? "danger" : level === "Moderate" ? "warning" : "success";
  return <span className={`badge text-bg-${variant}`}>{level}</span>;
}

function MetricCard({ title, value, trend, variant }) {
  const color =
    variant === "danger"
      ? "#ef4444"
      : variant === "warning"
      ? "#f59e0b"
      : "#22c55e";
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title
              className="mb-1"
              style={{ fontSize: 14, color: "#64748b" }}
            >
              {title}
            </Card.Title>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
          </div>
          <div style={{ color, fontWeight: 600 }}>{trend}</div>
        </div>
      </Card.Body>
    </Card>
  );
}

function AnxietyBadge({ level }) {
  const variant =
    level === "High" ? "danger" : level === "Moderate" ? "warning" : "success";
  return <Badge bg={variant}>{level}</Badge>;
}

function StudentDetailModal({ show, onHide, student, onSave }) {
  const [moodStability, setMoodStability] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState("");
  const [coping, setCoping] = useState("");
  const [impact, setImpact] = useState("");
  const [comments, setComments] = useState("");
  const [plan, setPlan] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    if (student?.psychologist_review) {
      setMoodStability(student.psychologist_review.stability || "");
      setAnxietyLevel(student.psychologist_review.anxiety_level || "");
      setCoping(student.psychologist_review.coping_mechanisms || "");
      setImpact(student.psychologist_review.academic_impact || "");
      setComments(student.psychologist_review.observation || "");
      setPlan(
        student.psychologist_review.psychologist_recommendation_action || ""
      );
      setIsReviewed(
        Boolean(student.psychologist_review.reviewed_by_psychologist)
      );
      setAlertMsg("");
    }
  }, [student]);

  if (!student) return null;

  const handleSave = async () => {
    try {
      await axios.post(`${API_URL}/api/psycologist`, {
        admission_id: student.admission_id,
        stability: moodStability,
        anxiety_level: anxietyLevel,
        coping_mechanisms: coping,
        academic_impact: impact,
        observation: comments,
        psychologist_recommendation_action: plan,
        reviewed_by_psychologist: isReviewed,
        review_date: isReviewed ? new Date().toISOString().slice(0, 10) : null,
      });

      alert("Mentor review saved successfully!");
      onSave(); // refresh students
      onHide();
    } catch (err) {
      console.error(err);
      alert("Failed to save psycatrist review");
    }
  };

  const analyzeStudent = async (admissionId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/ai-results/analyze/${admissionId}`
      );

      console.log("AI ANALYSIS RESULT:", res.data);

      alert("Analysis completed successfully!");

      // OPTIONAL: store result in state
      // setAnalysis(res.data.analysis);
    } catch (err) {
      console.error("AI ANALYSIS ERROR:", err);

      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to analyze student"
      );
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Student Profile - {student.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertMsg && <Alert variant="success">{alertMsg}</Alert>}

        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">Student Information</h6>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <strong>Student ID:</strong>
                <br />
                {student.student_id}
              </Col>
              <Col md={3}>
                <strong>Name:</strong>
                <br />
                {student.name}
              </Col>
              <Col md={3}>
                <strong>Department:</strong>
                <br />
                {student.department}
              </Col>
              <Col md={3}>
                <strong>Year/Course:</strong>
                <br />
                {student.year || "2"} / {student.course || student.department}
              </Col>
              <Col md={3}>
                <strong>GPA:</strong>
                <br />
                {student.gpa || "8.1"}
              </Col>
              <Col md={3}>
                <strong>Attendance %:</strong>
                <br />
                {student.attendance || "84"}%
              </Col>
              <Col md={3}>
                <strong>Risk Level:</strong>
                <br />
                <RiskBadge level={student.StudentAnalysis?.risk_level || "Low"} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="h-100">
  <Card.Header>
    <h6 className="mb-0">Student Responses</h6>
  </Card.Header>

  <Card.Body style={{ maxHeight: "420px", overflowY: "auto" }}>
    
    {/* 📝 TEXT RESPONSES */}
    <div className="mb-3">
      <strong className="text-primary">Text Responses</strong>

      <div className="mt-2">
        <small className="text-muted">Q1. When was the last time you felt proud of yourself in college? What happened?</small>
        <p>{student.text_answer?.question1 || "—"}</p>
      </div>

      <div>
        <small className="text-muted">Q2. 
What makes you feel disconnected or tired of studying these days?</small>
        <p>{student.text_answer?.question2 || "—"}</p>
      </div>

      <div>
        <small className="text-muted">Q3.If you could change one thing about your college experience, what would it be and why?</small>
        <p>{student.text_answer?.question3 || "—"}</p>
      </div>

      <div>
        <small className="text-muted">Q4.Who or what do you turn to when you feel emotionally low or anxious?</small>
        <p>{student.text_answer?.question4 || "—"}</p>
      </div>

      <div>
        <small className="text-muted">Q5Describe a moment recently when you felt completely lost, demotivated, or invisible.</small>
        <p>{student.text_answer?.question5 || "—"}</p>
      </div>

      <div>
        <small className="text-muted">Q6.What’s one small thing that keeps you going, even when things are hard?</small>
        <p>{student.text_answer?.question6 || "—"}</p>
      </div>

      <div>
        <small className="text-muted">Q7.How do you usually react when you fail or get low marks?</small>
        <p>{student.text_answer?.question7 || "—"}</p>
      </div>

      <div>
        <small className="text-muted">Q8.What’s something you wish your teachers or mentors understood about you?</small>
        <p>{student.text_answer?.question8 || "—"}</p>
      </div>
    </div>

    <hr />

    {/* 🧩 SHORT RESPONSES */}
    <div>
      <strong className="text-success">Quick Profile</strong>

      <ul className="list-unstyled mt-2 mb-0">
        <li><strong>Mood Today:</strong> {student.short_response?.today_mood || "—"}</li>
        <li><strong>Support Seeking:</strong> {student.short_response?.support_seeking || "—"}</li>
        <li><strong>Friend Circle:</strong> {student.short_response?.friend_circle || "—"}</li>
        <li><strong>Study Source:</strong> {student.short_response?.study_source || "—"}</li>
        <li><strong>Group Vibe:</strong> {student.short_response?.group_vibe || "—"}</li>
      </ul>
    </div>

  </Card.Body>
</Card>


        
        {/* try */}
        <Card className="h-100">
          <Card.Header>
            <h6 className="mb-0">AI Analysis Results</h6>
          </Card.Header>
          <Card.Body>
            <div className="mb-2">
              <strong>Video Analysis Score:</strong>
              <br />
              {/* Confidence: {student.ai_confidence}, Engagement: 6.8/10, */}
              Facial Expression:{" "}
              {student.StudentAnalysis?.video_emotion || "Neutral"}
            </div>
            <div className="mb-2">
              <strong>Text Analysis Emotion:</strong>
              <br />
              Sentiment: {student.StudentAnalysis?.emotion}
            </div>
            <div className="mb-2">
              <strong>Social-Sentiment:</strong>
              <br />
              {student.StudentAnalysis?.sentiment}
            </div>
            <div className="mb-2">
              <strong>AI Risk Level:</strong>
              <br />
              {student.StudentAnalysis?.risk_level}
            </div>
            <div className="mb-2">
              <strong>Learning Phase:</strong>
              <br />
              {student.StudentAnalysis?.learning_phase}
            </div>
            <div className="mb-2">
              <strong>Confidence Score:</strong>
              <br />
              {student.StudentAnalysis?.confidence_score}
            </div>
          </Card.Body>
          <Button
            variant="outline-secondary"
            onClick={() => analyzeStudent(student.admission_id)}
          >
            Analyze
          </Button>
        </Card>

        {/* try */}

        {/* <Row className="g-3 mb-3">
                    <Col md={6}>
                        <Card className="h-100">
                            <Card.Header>
                                <h6 className="mb-0">AI Emotional Analysis</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-2"><strong>Video Emotion:</strong><br />Facial: {student.facial_emotion || 'Neutral'}, Eye Contact: {student.eye_contact || 'Moderate'}, Engagement: {student.engagement_level || '6.8/10'}</div>
                                <div className="mb-2"><strong>Text Sentiment:</strong><br />Type: {student.textsentiment || 'Positive'}, Intensity: {student.emotional_intensity || 'Medium'}, Clarity: {student.clarity_score || '8.0'}/10</div>
                                <div className="mb-2"><strong>Social Behavior:</strong><br />Sentiment Score: {student.social_sentiment || '62'}/100</div>
                                <div className="mb-2"><strong>AI Risk Index:</strong><br />{student.ai_risk_score || '60'}/100</div>
                                <div className="mb-2"><strong>System Comments:</strong><br />{student.systemComments || 'Attendance dip detected; monitor assignments'}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="h-100">
                            <Card.Header>
                                <h6 className="mb-0">Mentor Review Summary</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-2"><strong>Notes:</strong><br />{student.mentor_review_notes || '—'}</div>
                                <div className="mb-2"><strong>Actions:</strong><br />{student.mentor_recommendation_action || '—'}</div>
                                <div className="mb-2"><strong>Action Plan:</strong><br />{student.mentor_custom_action_plan || '—'}</div>
                                <div className="mb-2"><strong>Last Updated:</strong><br />{student.last_updated || student.last || '—'}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row> */}

        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">Psychologist Review</h6>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>
                  <strong>Mood Stability</strong>
                </Form.Label>
                <Form.Select
                  value={moodStability}
                  onChange={(e) => setMoodStability(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Stable">Stable</option>
                  <option value="Fluctuating">Fluctuating</option>
                  <option value="Unstable">Unstable</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>
                  <strong>Anxiety Level</strong>
                </Form.Label>
                <Form.Select
                  value={anxietyLevel}
                  onChange={(e) => setAnxietyLevel(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>
                  <strong>Academic Impact</strong>
                </Form.Label>
                <Form.Select
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </Form.Select>
              </Col>
              <Col md={12}>
                <Form.Label>
                  <strong>Coping Mechanisms</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={coping}
                  onChange={(e) => setCoping(e.target.value)}
                  placeholder="e.g., Journaling, breathing exercises"
                />
              </Col>
              <Col md={12}>
                <Form.Label>
                  <strong>Observations / Comments</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Clinical observations, context, triggers"
                />
              </Col>
              <Col md={12}>
                <Form.Label>
                  <strong>Recommended Action Plan</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder="Intervention steps and timeline"
                />
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Mark as Reviewed"
                  checked={isReviewed}
                  onChange={(e) => setIsReviewed(e.target.checked)}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button disabled={saving} onClick={handleSave}>
          Save Review
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function PsychologistPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // const handleSaveStudent = (updated) => {
  //     setStudents(prev => prev.map(s => s.student_id === updated.student_id ? { ...s, ...updated } : s))
  // }

  const filtered = students.filter((s) =>
    `${s.admission_id} ${s.name}`.toLowerCase().includes(query.toLowerCase())
  );

  const totals = useMemo(
    () => ({
      total: students.length,
      high: students.filter(
        (s) => (s.anxiety_level || "").toLowerCase() === "high"
      ).length,
      moderate: students.filter(
        (s) => (s.anxiety_level || "").toLowerCase() === "moderate"
      ).length,
      low: students.filter(
        (s) => (s.anxiety_level || "").toLowerCase() === "low"
      ).length,
    }),
    [students]
  );

  const anxietyData = [
    { name: "High", count: totals.high },
    { name: "Moderate", count: totals.moderate },
    { name: "Low", count: totals.low },
  ];

  const lineData = [
    { day: "D-6", score: 68 },
    { day: "D-5", score: 65 },
    { day: "D-4", score: 70 },
    { day: "D-3", score: 66 },
    { day: "D-2", score: 63 },
    { day: "D-1", score: 60 },
    { day: "Today", score: 62 },
  ];

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col md={4}>
          <h2 className="mb-0">Psychologist Dashboard</h2>
        </Col>
        <Col md={7} className="my-2 my-md-0">
          <InputGroup>
            <Form.Control
              placeholder="Search by ID or name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-secondary">Search</Button>
          </InputGroup>
        </Col>
        {/* <Col md={3} className="d-flex justify-content-md-end gap-2">
          <Button variant="outline-secondary">Profile</Button>
          <Button variant="outline-danger">Logout</Button>
        </Col> */}
      </Row>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <MetricCard
            title="Total Students"
            value={totals.total}
            trend="↑ 3%"
            variant="primary"
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="High Anxiety"
            value={totals.high}
            trend="↑ 2%"
            variant="danger"
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Moderate Stress"
            value={totals.moderate}
            trend="→ 0%"
            variant="warning"
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Stable Students"
            value={totals.low}
            trend="↓ 1%"
            variant="success"
          />
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="mb-0">
                  Student Emotional Overview
                </Card.Title>
              </div>
              <Table hover responsive className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Emotional Stability</th>
                    <th>Anxiety Level</th>
                    <th>Last Reviewed</th>
                    <th>Psychologist Reviewed</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.admission_id}>
                      <td>{s.admission_id}</td>
                      <td>{s.name}</td>
                      <td>{s.department}</td>
                      <td>{s.psychologist_review?.stability || "—"}</td>
                      <td>
                        <AnxietyBadge
                          level={s.psychologist_review?.anxiety_level || "Low"}
                        />
                      </td>
                      <td>
                        {s.psychologist_review?.last_updated || s.last || "—"}
                      </td>
                      <td>
                        {s.psychologist_review?.reviewed_by_psychologist
                          ? "Yes"
                          : "No"}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelected(s);
                            setShow(true);
                          }}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Notifications</Card.Title>
              <ul className="list-unstyled small mb-0">
                <li className="mb-2">
                  2 students show elevated stress levels.
                </li>
                <li className="mb-2">
                  AI detected sudden emotional drop in one student.
                </li>
                <li className="mb-2">
                  3 students pending for psychologist review.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">
                Anxiety Level Distribution
              </Card.Title>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={anxietyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Emotional Trend (7 days)</Card.Title>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <StudentDetailModal
        show={show}
        onHide={() => setShow(false)}
        student={selected}
        onSave={fetchStudents}
      />
    </Container>
  );
}

export default PsychologistPage;
