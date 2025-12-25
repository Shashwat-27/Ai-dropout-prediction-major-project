import { useMemo, useState, useEffect } from "react";
// import { supabase } from "../../supabaseClient";
import axios from "axios";
import { API_URL } from "../../api";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
  Badge,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function RiskBadge({ level }) {
  const variant =
    level === "High" ? "danger" : level === "Medium" ? "warning" : "success";
  return <Badge bg={variant}>{level}</Badge>;
}

function MetricCard({ title, value, variant }) {
  const color =
    variant === "danger"
      ? "#ef4444"
      : variant === "warning"
      ? "#f59e0b"
      : "#2563eb";
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title className="mb-1" style={{ fontSize: 14, color: "#64748b" }}>
          {title}
        </Card.Title>
        <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      </Card.Body>
    </Card>
  );
}

function CollegePage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const [course, setCourse] = useState("");
  const [risk, setRisk] = useState("");
  const [year, setYear] = useState("");
  const [gpaMin, setGpaMin] = useState("");
  const [attMin, setAttMin] = useState("");

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };

  const [form, setForm] = useState({
    admission_id: "",
    name: "",
    dob: "",
    gender: "",
    address: "",
    email: "",
    phone: "",
    emergency: "",
    department: "",
    year: "",
    course: "",
    gpa: "",
    attendance: "",
    enrollmentDate: "",
    notes: "",
    extracurricular: "",
    disciplinary: "",
    risk: "Low",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const [showModal, setShowModal] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const totals = useMemo(
    () => ({
      total: students.length,
      atRisk: students.filter((s) => s.risk !== "Low").length,
      retained: students.filter((s) => s.risk === "Low").length,
    }),
    [students]
  );

  const filtered = students.filter((s) => {
    const q = `${s.admission_id} ${s.name}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const d = dept ? s.department === dept : true;
    const c = course ? s.course === course : true;
    const r = risk ? s.risk === risk : true;
    const y = year ? s.year === year : true;
    const g = gpaMin ? Number(s.gpa) >= Number(gpaMin) : true;
    const a = attMin ? Number(s.attendance) >= Number(attMin) : true;
    return q && d && c && r && y && g && a;
  });

  const deptDistribution = useMemo(() => {
    const groups = students.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [students]);

  const COLORS = ["#60a5fa", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"];

  const riskTrend = [
    { month: "Jun", dropouts: 5, attendance: 82 },
    { month: "Jul", dropouts: 7, attendance: 80 },
    { month: "Aug", dropouts: 6, attendance: 81 },
    { month: "Sep", dropouts: 8, attendance: 79 },
    { month: "Oct", dropouts: 6, attendance: 83 },
  ];

  /* Placeholder for future risk category chart data
	const riskCategory = [
		{ name: 'High', count: students.filter(s => s.risk==='High').length },
		{ name: 'Medium', count: students.filter(s => s.risk==='Medium').length },
		{ name: 'Low', count: students.filter(s => s.risk==='Low').length },
	]
*/

  return (
    <Container fluid className="py-3">
      {/* Registration / Add Student */}
      <Card className="shadow-sm mb-3">
        <Card.Body>
          <Card.Title className="mb-3">Student Registration</Card.Title>
          {formStatus.message && (
            <Alert
              variant={formStatus.type === "error" ? "danger" : "success"}
              className="mb-3"
            >
              {formStatus.message}
            </Alert>
          )}
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                !form.admission_id ||
                !form.name ||
                !form.email ||
                !form.department ||
                !form.year
              ) {
                setFormStatus({
                  type: "error",
                  message:
                    "Please fill required fields: ID, Name, Email, Department, Year.",
                });
                return;
              }

              const exists = students.some(
                (s) => s.admission_id === form.admission_id
              );
              if (exists) {
                setFormStatus({
                  type: "error",
                  message: "Student ID already exists.",
                });
                return;
              }

              // const newStudent = {
              //   ...form,
              //   gpa: Number(form.gpa || 0),
              //   attendance: Number(form.attendance || 0),
              //   last: new Date().toISOString().slice(0, 10),
              // };

              try {
                await axios.post(`${API_URL}/api/students`, {
                  admission_id: form.admission_id,
                  name: form.name,
                  dob: form.dob || null,
                  gender: form.gender || null,
                  address: form.address || null,
                  email: form.email,
                  phone: form.phone || null,
                  emergency: form.emergency || null,
                  department: form.department,
                  year: Number(form.year),
                  course: form.course || null,
                  gpa: Number(form.gpa || 0),
                  attendance: Number(form.attendance || 0),
                  enrollmentDate: form.enrollmentDate || null,
                  notes: form.notes || null,
                  extracurricular: form.extracurricular || null,
                  disciplinary: form.disciplinary || null,
                  risk: form.risk || "Low",
                });

                setFormStatus({
                  type: "success",
                  message: "Student added successfully.",
                });

                fetchStudents();

                setForm({
                  admission_id: "",
                  name: "",
                  dob: "",
                  gender: "",
                  address: "",
                  email: "",
                  phone: "",
                  emergency: "",
                  department: "",
                  year: "",
                  course: "",
                  gpa: "",
                  attendance: "",
                  enrollmentDate: "",
                  notes: "",
                  extracurricular: "",
                  disciplinary: "",
                  risk: "Low",
                });
              } catch (err) {
                setFormStatus({
                  type: "error",
                  message:
                    err.response?.data?.message ||
                    err.message ||
                    "Error adding student",
                });
              }
            }}
          >
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>Student ID*</Form.Label>
                <Form.Control
                  value={form.admission_id}
                  onChange={(e) => setForm({ ...form, admission_id: e.target.value })}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label>Full Name*</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>Email*</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control
                  value={form.emergency}
                  onChange={(e) =>
                    setForm({ ...form, emergency: e.target.value })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>Department*</Form.Label>
                <Form.Select
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>IT</option>
                  <option>ME</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>Year*</Form.Label>
                <Form.Select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Course/Branch</Form.Label>
                <Form.Control
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                />
              </Col>
              <Col md={2}>
                <Form.Label>GPA</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={form.gpa}
                  onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                />
              </Col>
              <Col md={2}>
                <Form.Label>Attendance %</Form.Label>
                <Form.Control
                  type="number"
                  step="1"
                  value={form.attendance}
                  onChange={(e) =>
                    setForm({ ...form, attendance: e.target.value })
                  }
                />
              </Col>
              <Col md={2}>
                <Form.Label>Enrollment Date</Form.Label>
                <Form.Control
                  type="date"
                  value={form.enrollmentDate}
                  onChange={(e) =>
                    setForm({ ...form, enrollmentDate: e.target.value })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>Behavioral Notes</Form.Label>
                <Form.Control
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Extracurricular</Form.Label>
                <Form.Control
                  value={form.extracurricular}
                  onChange={(e) =>
                    setForm({ ...form, extracurricular: e.target.value })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>Disciplinary</Form.Label>
                <Form.Control
                  value={form.disciplinary}
                  onChange={(e) =>
                    setForm({ ...form, disciplinary: e.target.value })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>AI Risk Level</Form.Label>
                <Form.Select
                  value={form.risk}
                  onChange={(e) => setForm({ ...form, risk: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </Form.Select>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button type="submit">Submit</Button>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setForm({
                    id: "",
                    name: "",
                    dob: "",
                    gender: "",
                    address: "",
                    email: "",
                    phone: "",
                    emergency: "",
                    department: "",
                    year: "",
                    course: "",
                    gpa: "",
                    attendance: "",
                    enrollmentDate: "",
                    notes: "",
                    extracurricular: "",
                    disciplinary: "",
                    risk: "Low",
                  })
                }
              >
                Clear
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {/* Overview */}
      <Row className="g-3 mb-3">
        <Col md={4}>
          <MetricCard
            title="Total Students"
            value={totals.total}
            variant="primary"
          />
        </Col>
        <Col md={4}>
          <MetricCard
            title="At-Risk Students"
            value={totals.atRisk}
            variant="danger"
          />
        </Col>
        <Col md={4}>
          <MetricCard
            title="Successfully Retained"
            value={totals.retained}
            variant="primary"
          />
        </Col>
      </Row>

      {/* Search & Filters */}
      <Card className="shadow-sm mb-3">
        <Card.Body>
          <Row className="g-2 align-items-end">
            <Col md={4}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Student name or ID"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant="outline-secondary">Search</Button>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="">All</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>IT</option>
                <option>ME</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="">All</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>IT</option>
                <option>ME</option>
                <option>CSE-DS</option>
                <option>CSE-AIML</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Risk Level</Form.Label>
              <Form.Select
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
              >
                <option value="">All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Year</Form.Label>
              <Form.Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>GPA ≥</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={gpaMin}
                onChange={(e) => setGpaMin(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Attendance ≥</Form.Label>
              <Form.Control
                type="number"
                step="1"
                value={attMin}
                onChange={(e) => setAttMin(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Students Table & Alerts */}
      <Row className="g-3">
        <Col lg={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Students</Card.Title>
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Attendance %</th>
                    <th>GPA</th>
                    <th>Risk Level</th>
                    <th>Last Intervention</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.admission_id}>
                      <td>{s.admission_id}</td>
                      <td>{s.name}</td>
                      <td>{s.department}</td>
                      <td>{s.attendance}%</td>
                      <td>{s.gpa}</td>
                      <td>
                        <RiskBadge level={s.risk} />
                      </td>
                      <td>{s.last}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setModalStudent(s);
                              setEditMode(false);
                              setShowModal(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => {
                              setModalStudent(s);
                              setEditMode(true);
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={async () => {
                              if (!window.confirm("Delete this student?"))
                                return;

                              try {
                                await axios.delete(
                                  `${API_URL}/api/students/${s.admission_id}`
                                );

                                alert("Student deleted successfully!");

                                // safest way
                                fetchStudents();
                              } catch (err) {
                                console.error("Delete failed:", err);
                                alert(
                                  err.response?.data?.message ||
                                    err.message ||
                                    "Failed to delete student"
                                );
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
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
              <Card.Title>Alerts</Card.Title>
              <ul className="list-unstyled small mb-3">
                <li className="mb-2">
                  <Badge bg="danger">High</Badge> Neha Singh (CSE) flagged for
                  low attendance.
                </li>
                <li className="mb-2">
                  <Badge bg="warning">Medium</Badge> Ravi Kumar shows GPA
                  decline.
                </li>
                <li className="mb-2">
                  2 students show sudden negative sentiment.
                </li>
              </ul>
              <div className="d-grid gap-2">
                <Form.Label className="small">Bulk Import (CSV)</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    const lines = text.trim().split(/\r?\n/);
                    const rows = lines.slice(1).map((l) => l.split(","));
                    const imported = rows.map((r) => ({
                      id: r[0],
                      name: r[1],
                      department: r[2],
                      year: r[3],
                      gpa: Number(r[4] || 0),
                      attendance: Number(r[5] || 0),
                      risk: r[6] || "Low",
                      last: new Date().toISOString().slice(0, 10),
                    }));
                    setStudents((prev) => [...imported, ...prev]);
                    e.target.value = "";
                  }}
                />
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => {
                    const header = [
                      "id",
                      "name",
                      "department",
                      "year",
                      "gpa",
                      "attendance",
                      "risk",
                      "last",
                    ];
                    const rows = students.map((s) => [
                      s.admission_id,
                      s.name,
                      s.department,
                      s.year,
                      s.gpa,
                      s.attendance,
                      s.risk,
                      s.last,
                    ]);
                    const csv = [
                      header.join(","),
                      ...rows.map((r) => r.join(",")),
                    ].join("\n");
                    const blob = new Blob([csv], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "students.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export Data (CSV)
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analytics */}
      <Row className="g-3 mt-1">
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">
                Department-wise Distribution
              </Card.Title>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={deptDistribution}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label
                    >
                      {deptDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">
                Drop-out & Attendance Trends
              </Card.Title>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={riskTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="dropouts"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Profile Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Student" : "Student Profile"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalStudent && (
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editMode) return;

                try {
                  await axios.put(
                    `${API_URL}/api/students/${modalStudent.admission_id}`,
                    {
                      name: modalStudent.name,
                      department: modalStudent.department,
                      year: Number(modalStudent.year),
                      gpa: Number(modalStudent.gpa),
                      attendance: Number(modalStudent.attendance),
                      address: modalStudent.address || null,
                      email: modalStudent.email,
                      phone: modalStudent.phone || null,
                      notes: modalStudent.notes || null,
                      disciplinary: modalStudent.disciplinary || null,
                      risk: modalStudent.risk,
                    }
                  );

                  alert("Student updated successfully!");

                  // safest sync
                  fetchStudents();

                  setShowModal(false);
                  setEditMode(false);
                } catch (err) {
                  console.error("Error updating student:", err);
                  alert(
                    err.response?.data?.message ||
                      err.message ||
                      "Update failed"
                  );
                }
              }}
            >
              <Row className="g-3">
                <Col md={4}>
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control value={modalStudent.admission_id} disabled />
                </Col>
                <Col md={8}>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    value={modalStudent.name}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({ ...modalStudent, name: e.target.value })
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    value={modalStudent.department}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        department: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    value={modalStudent.year}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({ ...modalStudent, year: e.target.value })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>GPA</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={modalStudent.gpa}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        gpa: Number(e.target.value),
                      })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>Attendance %</Form.Label>
                  <Form.Control
                    type="number"
                    step="1"
                    value={modalStudent.attendance}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        attendance: Number(e.target.value),
                      })
                    }
                  />
                </Col>
                <Col md={12}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    value={modalStudent.address || ""}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        address: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={modalStudent.email || ""}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        email: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    value={modalStudent.phone || ""}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        phone: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Behavioral Notes</Form.Label>
                  <Form.Control
                    value={modalStudent.notes || ""}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        notes: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Disciplinary</Form.Label>
                  <Form.Control
                    value={modalStudent.disciplinary || ""}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({
                        ...modalStudent,
                        disciplinary: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Risk Level</Form.Label>
                  <Form.Select
                    value={modalStudent.risk}
                    disabled={!editMode}
                    onChange={(e) =>
                      setModalStudent({ ...modalStudent, risk: e.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </Form.Select>
                </Col>
              </Row>
              <div className="mt-3 d-flex gap-2">
                {editMode ? (
                  <Button type="submit">Save</Button>
                ) : (
                  <Button
                    onClick={() => setEditMode(true)}
                    variant="outline-secondary"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CollegePage;
