import { useMemo, useState, useEffect } from "react";

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
import axios from "axios";
import { API_URL } from "../../api";

function RiskBadge({ level }) {
  const variant =
    level === "High" ? "danger" : level === "Medium" ? "warning" : "success";
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

function StudentDetailModal({ show, onHide, student, onSave }) {
  const [mentorNotes, setMentorNotes] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    if (student?.mentor_insight) {
      setMentorNotes(student.mentor_insight.mentor_observation || "");
      setActionTaken(student.mentor_insight.mentor_action || "");
      setActionPlan(student.mentor_insight.psychologist_suggestion || "");
      setIsReviewed(student.mentor_insight.reviewed_by_mentor || false);
    }
  }, [student]);

  if (!student) return null;

  const handleSave = async () => {
    try {
      await axios.post(`${API_URL}/api/mentor-insights`, {
        admission_id: student.admission_id,
        mentor_review_notes: mentorNotes,
        mentor_recommendation_action: actionTaken,
        mentor_custom_action_plan: actionPlan,
        reviewed_by_mentor: isReviewed,
      });

      alert("Mentor review saved successfully!");
      onSave(); // refresh students
      onHide();
    } catch (err) {
      console.error(err);
      alert("Failed to save mentor review");
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
        {/* Student Basic Info */}
        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">Student Information</h6>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <strong>Student ID:</strong>
                <br />
                {student.admission_id}
              </Col>
              <Col md={3}>
                <strong>Full Name:</strong>
                <br />
                {student.name}
              </Col>
              <Col md={3}>
                <strong>Department/Year:</strong>
                <br />
                {student.department} Year {student.year || "2"}
              </Col>
              <Col md={3}>
                <strong>Course/Branch:</strong>
                <br />
                {student.course || student.department}
              </Col>
              <Col md={3}>
                <strong>GPA:</strong>
                <br />
                {student.gpa || "8.2"}
              </Col>
              <Col md={3}>
                <strong>Attendance %:</strong>
                <br />
                {student.attendance || "85"}%
              </Col>
              <Col md={3}>
                <strong>Enrollment Date:</strong>
                <br />
                {student.enrollmentDate || "2022-08-01"}
              </Col>
              <Col md={3}>
                <strong>Risk Level:</strong>
                <br />
                <Badge
                  bg={
                    student.risk === "High"
                      ? "danger"
                      : student.risk === "Medium"
                      ? "warning"
                      : "success"
                  }
                >
                  {student.risk}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Academic & Behavioral Info */}
        <Row className="g-3 mb-3">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">Academic & Behavioral Details</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <strong>Behavioral Notes:</strong>
                  <br />
                  {student.notes ||
                    "Regular attendance, participates in class discussions"}
                </div>
                <div className="mb-2">
                  <strong>Extracurricular Activities:</strong>
                  <br />
                  {student.extracurricular || "Coding Club, Sports"}
                </div>
                <div className="mb-2">
                  <strong>Disciplinary Records:</strong>
                  <br />
                  {student.disciplinary || "None"}
                </div>
                <div className="mb-2">
                  <strong>Short Test Score:</strong>
                  <br />
                  {student.testScore || "78%"}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">AI Analysis Results</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <strong>Video Analysis Score:</strong>
                  <br />
                  {/* Confidence: {student.ai_confidence}, Engagement: 6.8/10, */}
                  Facial Expression: {student.StudentAnalysis?.video_emotion || "Neutral"}
                </div>
                <div className="mb-2">
                  <strong>Text Analysis Emotion:</strong>
                  <br />
                  Sentiment: {student.StudentAnalysis?.emotion }
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
                  {student.StudentAnalysis?.learning_phase }
                </div>
                <div className="mb-2">
                  <strong>Confidence Score:</strong>
                  <br />
                  {student.StudentAnalysis?.confidence_score}
                </div>
              </Card.Body>
              <Button variant="outline-secondary" onClick={() => analyzeStudent(student.admission_id)}>
          Analyze
        </Button>
            </Card>
          </Col>
        </Row>

        {/* previous action taken */}
        <Row className="g-3 mb-3">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">Pshycologist Review</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <strong>Mood Stability:</strong>
                  <br />
                  {student.stability || "Fluctuating"}
                </div>
                <div className="mb-2">
                  <strong>Anxiety Level:</strong>
                  <br />
                  {student.anxiety_level || "Moderate"}
                </div>
                <div className="mb-2">
                  <strong>Coping Mechanisms:</strong>
                  <br />
                  {student.coping_mechanisms || "Journaling,Music"}
                </div>
                <div className="mb-2">
                  <strong>Academic Impact:</strong>
                  <br />
                  {student.academic_impact || "Moderate"}
                </div>
                <div className="mb-2">
                  <strong>Observation:</strong>
                  <br />
                  {student.observation || "Shows mild anxiety under workload"}
                </div>
                <div className="mb-2">
                  <strong>Recommended Action:</strong>
                  <br />
                  {student.psychologist_recommendation_action ||
                    "Weekly counselling session"}
                </div>
                <div className="mb-2">
                  <strong>Psychologist Name:</strong>
                  <br />
                  {student.psychologist_name || "Dr Meera Sharma"}
                </div>
              </Card.Body>
              
            </Card>
            
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">Mentor Review</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <strong>Mentor Review / Notes:</strong>
                  <br />
                  {student.mentor_insight?.mentor_review_notes ||
                    "Regular attendance, participates in class discussions"}
                </div>
                <div className="mb-2">
                  <strong>Action Taken / Recommendation:</strong>
                  <br />
                  {student.mentor_insight?.mentor_recommendation_action ||
                    "Weekly one-on-one meeting"}
                </div>
                <div className="mb-2">
                  <strong>Custom Action Plan:</strong>
                  <br />
                  {student.mentor_insight?.mentor_custom_action_plan ||
                    "Weekly one-on-one meeting with Dr Meera Sharma"}
                </div>
              </Card.Body>
              
            </Card>
          </Col>
        </Row>

        {/* Mentor Review Section */}
        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">Mentor Review & Action Plan</h6>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Label>
                  <strong>Mentor Review / Notes</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your observations and assessment of the student..."
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Form.Label>
                  <strong>Action Taken / Recommendation</strong>
                </Form.Label>
                <Form.Select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                >
                  <option value="">Select Action</option>
                  <option value="weekly_meeting">
                    Weekly One-on-One Meeting
                  </option>
                  <option value="counseling">Refer to Counseling</option>
                  <option value="academic_support">
                    Academic Support Session
                  </option>
                  <option value="peer_mentoring">Assign Peer Mentor</option>
                  <option value="parent_contact">
                    Contact Parents/Guardians
                  </option>
                  <option value="monitoring">Increased Monitoring</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>
                  <strong>Custom Action Plan</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Describe specific steps and timeline for intervention..."
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
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

        {/* Previous Reviews */}
        {/* {student.previousReviews && student.previousReviews.length > 0 && (
					<Card>
						<Card.Header>
							<h6 className="mb-0">Previous Mentor Reviews</h6>
						</Card.Header>
						<Card.Body>
							{student.previousReviews.map((review, index) => (
								<div key={index} className="border-bottom pb-2 mb-2">
									<div className="small text-muted">{review.date||'hello world'}</div>
									<div><strong>Action:</strong> {review.action}</div>
									<div><strong>Notes:</strong> {review.notes}</div>
								</div>
							))}
						</Card.Body>
					</Card>
				)} */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button onClick={handleSave}>Save Review & Action Plan</Button>
      </Modal.Footer>
    </Modal>
  );
}

function MentorPage() {
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

//   const handleSaveStudent = (updatedStudent) => {
//     setStudents((prev) =>
//       prev.map((s) =>
//         s.admission_id === updatedStudent.admission_id
//           ? { ...s, ...updatedStudent }
//           : s
//       )
//     );
//   };

  const filtered = students.filter((s) =>
    `${s.admission_id} ${s.name}`.toLowerCase().includes(query.toLowerCase())
  );

  const totals = useMemo(
    () => ({
      total: students.length,
      high: students.filter((s) => s.StudentAnalysis?.risk_level === "High").length,
      medium: students.filter((s) => s.StudentAnalysis?.risk_level === "Medium").length,
      low: students.filter((s) => s.StudentAnalysis?.risk_level === "Low").length,
    }),
    [students]
  );

  const categoryData = [
    { name: "High", count: totals.high },
    { name: "Medium", count: totals.medium },
    { name: "Low", count: totals.low },
  ];

  const trendData = [
    { day: "Mon", risk: 12 },
    { day: "Tue", risk: 15 },
    { day: "Wed", risk: 11 },
    { day: "Thu", risk: 14 },
    { day: "Fri", risk: 9 },
  ];

  return (
    <Container fluid className="py-3">
      {/* Header */}
      <Row className="align-items-center mb-3">
        <Col md={4}>
          <h2 className="mb-0">Mentor Dashboard</h2>
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

      {/* Metrics */}
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
            title="High Risk"
            value={totals.high}
            trend="↑ 1%"
            variant="danger"
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Medium Risk"
            value={totals.medium}
            trend="→ 0%"
            variant="warning"
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Low Risk"
            value={totals.low}
            trend="↓ 2%"
            variant="success"
          />
        </Col>
      </Row>

      {/* Table + Notifications */}
      <Row className="g-3">
        <Col lg={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="mb-0">Student Risk Analysis</Card.Title>
              </div>
              <Table hover responsive className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Risk Level</th>
                    <th>Last Updated</th>
                    <th>Reviewed</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.admission_id}>
                      <td>{s.admission_id}</td>
                      <td>{s.name}</td>
                      <td>{s.department}</td>
                      <td>
                        <RiskBadge level={s.StudentAnalysis?.risk_level} />
                      </td>
                      <td>{s.last || s.last_updated}</td>
                      <td>{s.mentor_insight?.reviewed_by_mentor ? "Yes" : "No"}</td>
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
                <li className="mb-2">Neha Singh flagged High Risk.</li>
                <li className="mb-2">
                  2 students show sudden negative sentiment.
                </li>
                <li className="mb-2">Weekly check-ins due for 3 students.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-3 mt-1">
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">
                Risk Category Distribution
              </Card.Title>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Risk Trend (Last 5 days)</Card.Title>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="risk"
                      stroke="#2563eb"
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

export default MentorPage;
