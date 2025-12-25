import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Accordion,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

function FeatureCard({ icon, title, desc, color = "primary" }) {
  const colorMap = {
    primary: { bg: "#3b82f6", text: "#ffffff" },
    success: { bg: "#10b981", text: "#ffffff" },
    warning: { bg: "#f59e0b", text: "#ffffff" },
    info: { bg: "#06b6d4", text: "#ffffff" },
    danger: { bg: "#ef4444", text: "#ffffff" },
    secondary: { bg: "#8b5cf6", text: "#ffffff" },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <Card
      className="h-100 border-0"
      style={{
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        backgroundColor: "#ffffff",
        border: "1px solid #f1f5f9",
      }}
    >
      <Card.Body className="text-center p-4">
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: 60,
            height: 60,
            backgroundColor: selectedColor.bg,
            color: selectedColor.text,
          }}
        >
          <span style={{ fontSize: 24 }}>{icon}</span>
        </div>
        <Card.Title className="h5 mb-3" style={{ color: "#1e293b" }}>
          {title}
        </Card.Title>
        <Card.Text style={{ color: "#64748b" }}>{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function StatCard({ number, label, icon }) {
  return (
    <Col md={3} className="text-center mb-4">
      <div
        className="rounded-3 p-4"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div className="display-4 fw-bold mb-2" style={{ color: "#3b82f6" }}>
          {number}
        </div>
        <div className="mb-2" style={{ color: "#64748b" }}>
          {label}
        </div>
        <div style={{ fontSize: 24 }}>{icon}</div>
      </div>
    </Col>
  );
}

function TestimonialCard({ name, role, content, avatar }) {
  return (
    <Card
      className="h-100 border-0"
      style={{
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        backgroundColor: "#ffffff",
        border: "1px solid #f1f5f9",
      }}
    >
      <Card.Body className="p-4">
        <Card.Text className="mb-3" style={{ color: "#475569" }}>
          "{content}"
        </Card.Text>
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#3b82f6",
              color: "#ffffff",
            }}
          >
            {avatar}
          </div>
          <div>
            <div className="fw-semibold" style={{ color: "#1e293b" }}>
              {name}
            </div>
            <div className="small" style={{ color: "#64748b" }}>
              {role}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function Landing() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  const dashboardByRole = {
    Student: "/student",
    Mentor: "/mentor",
    Psychologist: "/psychologist",
    College: "/college",
    Admin: "/college",
  };

  const handleGetStarted = () => {
    if (loading) return; // safety

    if (isAuthenticated && user?.role) {
      navigate(dashboardByRole[user.role] || "/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section
        className="text-white py-5"
        style={{
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%)",
        }}
      >
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1
                className="display-4 fw-bold mb-4"
                style={{ color: "#ffffff" }}
              >
                Prevent Student Dropouts with AI-Powered Insights{" "}
              </h1>
              <p className="lead mb-4" style={{ color: "#e2e8f0" }}>
                Identify at-risk students early, coordinate mentors and
                psychologists, and drive success with data-informed
                interventions. Transform your institution's student support
                system.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  size="lg"
                  variant="light"
                  className="px-4"
                  style={{
                    backgroundColor: "#f8fafc",
                    color: "#1e40af",
                    border: "none",
                    fontWeight: "600",
                  }}
                  onClick={handleGetStarted}
                >
                  Get Started Free
                </Button>

                <Button
                  as={Link}
                  to="#features"
                  size="lg"
                  variant="outline-light"
                  className="px-4"
                  style={{ borderColor: "#cbd5e1", color: "#ffffff" }}
                >
                  Learn More
                </Button>
              </div>
              <div className="mt-4">
                <Badge
                  className="me-2"
                  style={{ backgroundColor: "#10b981", color: "#ffffff" }}
                >
                  ✨ AI-Powered
                </Badge>
                <Badge
                  className="me-2"
                  style={{ backgroundColor: "#8b5cf6", color: "#ffffff" }}
                >
                  📊 Data-Driven
                </Badge>
                <Badge style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}>
                  🎯 Proactive
                </Badge>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div
                className="bg-white rounded-3 p-4 shadow-lg"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div className="mb-3" style={{ color: "#3b82f6" }}>
                  <span style={{ fontSize: 48 }}>📈</span>
                </div>
                <h5 className="text-dark" style={{ color: "#1e293b" }}>
                  Real-time Risk Assessment
                </h5>
                <p style={{ color: "#64748b" }}>
                  Monitor student well-being with advanced analytics
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Statistics Section */}
      <section className="py-5" style={{ backgroundColor: "#f8fafc" }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold" style={{ color: "#1e293b" }}>
                Trusted by Educational Institutions
              </h2>
              <p className="lead" style={{ color: "#64748b" }}>
                Join hundreds of colleges using our platform
              </p>
            </Col>
          </Row>
          <Row>
            <StatCard number="500+" label="Students Monitored" icon="👥" />
            <StatCard number="95%" label="Accuracy Rate" icon="🎯" />
            <StatCard number="40%" label="Dropout Reduction" icon="📉" />
            <StatCard number="24/7" label="AI Monitoring" icon="🤖" />
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section
        className="py-5"
        id="features"
        style={{ backgroundColor: "#ffffff" }}
      >
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold" style={{ color: "#1e293b" }}>
                Powerful Features for Student Success
              </h2>
              <p className="lead" style={{ color: "#64748b" }}>
                Comprehensive tools to identify, support, and guide students
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col lg={4} md={6}>
              <FeatureCard
                icon="🤖"
                title="AI Dropout Prediction"
                desc="Advanced machine learning algorithms analyze academic performance, attendance patterns, and behavioral indicators to predict dropout risk with 95% accuracy."
                color="primary"
              />
            </Col>
            <Col lg={4} md={6}>
              <FeatureCard
                icon="👨‍🏫"
                title="Mentor Management"
                desc="Streamlined mentor assignment and tracking system with automated alerts, progress monitoring, and intervention recommendations."
                color="success"
              />
            </Col>
            <Col lg={4} md={6}>
              <FeatureCard
                icon="🧠"
                title="Psychological Support"
                desc="Integrated psychologist dashboard for emotional monitoring, mental health tracking, and personalized intervention plans."
                color="warning"
              />
            </Col>
            <Col lg={4} md={6}>
              <FeatureCard
                icon="📊"
                title="Real-time Analytics"
                desc="Comprehensive dashboards with live data visualization, trend analysis, and predictive insights for informed decision-making."
                color="info"
              />
            </Col>
            <Col lg={4} md={6}>
              <FeatureCard
                icon="🎯"
                title="Early Intervention"
                desc="Proactive alert system that identifies at-risk students before they reach critical stages, enabling timely support."
                color="danger"
              />
            </Col>
            <Col lg={4} md={6}>
              <FeatureCard
                icon="📱"
                title="Mobile Access"
                desc="Responsive design with mobile app capabilities for mentors and psychologists to access student data anywhere, anytime."
                color="secondary"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ backgroundColor: "#f8fafc" }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold" style={{ color: "#1e293b" }}>
                How It Works
              </h2>
              <p className="lead" style={{ color: "#64748b" }}>
                Simple steps to transform your student support system
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                }}
              >
                <span className="h3 mb-0">1</span>
              </div>
              <h4 style={{ color: "#1e293b" }}>Data Collection</h4>
              <p style={{ color: "#64748b" }}>
                Automatically gather student data from academic records,
                attendance systems, and behavioral indicators.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#10b981",
                  color: "#ffffff",
                }}
              >
                <span className="h3 mb-0">2</span>
              </div>
              <h4 style={{ color: "#1e293b" }}>AI Analysis</h4>
              <p style={{ color: "#64748b" }}>
                Our AI algorithms process the data to identify patterns and
                predict dropout risk with high accuracy.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#f59e0b",
                  color: "#ffffff",
                }}
              >
                <span className="h3 mb-0">3</span>
              </div>
              <h4 style={{ color: "#1e293b" }}>Intervention</h4>
              <p style={{ color: "#64748b" }}>
                Mentors and psychologists receive alerts and recommendations to
                provide targeted support to at-risk students.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold" style={{ color: "#1e293b" }}>
                What Our Users Say
              </h2>
              <p className="lead" style={{ color: "#64748b" }}>
                Success stories from educational institutions
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col lg={4}>
              <TestimonialCard
                name="Dr. Sarah Johnson"
                role="Dean of Students, Tech University"
                content="This platform has revolutionized how we support our students. We've seen a 40% reduction in dropout rates since implementation."
                avatar="S"
              />
            </Col>
            <Col lg={4}>
              <TestimonialCard
                name="Prof. Michael Chen"
                role="Academic Advisor, State College"
                content="The AI predictions are incredibly accurate. We can now intervene before students reach crisis point."
                avatar="M"
              />
            </Col>
            <Col lg={4}>
              <TestimonialCard
                name="Dr. Emily Rodriguez"
                role="Counseling Director, Community College"
                content="The psychologist dashboard has streamlined our mental health support. We can track student well-being in real-time."
                avatar="E"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-5" style={{ backgroundColor: "#f8fafc" }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold" style={{ color: "#1e293b" }}>
                Frequently Asked Questions
              </h2>
              <p className="lead" style={{ color: "#64748b" }}>
                Everything you need to know about our platform
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    How accurate is the AI dropout prediction?
                  </Accordion.Header>
                  <Accordion.Body>
                    Our AI models achieve 95% accuracy in predicting student
                    dropout risk by analyzing multiple data points including
                    academic performance, attendance patterns, and behavioral
                    indicators.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    Is student data secure and private?
                  </Accordion.Header>
                  <Accordion.Body>
                    Yes, we use enterprise-grade security with end-to-end
                    encryption. All data is stored securely and complies with
                    FERPA and other educational privacy regulations.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    How long does implementation take?
                  </Accordion.Header>
                  <Accordion.Body>
                    Implementation typically takes 2-4 weeks, including data
                    integration, staff training, and system configuration. Our
                    team provides full support throughout the process.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    Can the system integrate with our existing LMS?
                  </Accordion.Header>
                  <Accordion.Body>
                    Yes, our platform integrates seamlessly with popular
                    Learning Management Systems including Canvas, Blackboard,
                    Moodle, and others through secure APIs.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="py-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%)",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col>
              <h2
                className="display-6 fw-bold mb-4"
                style={{ color: "#ffffff" }}
              >
                Ready to Transform Student Success?
              </h2>
              <p className="lead mb-4" style={{ color: "#e2e8f0" }}>
                Join hundreds of institutions already using our platform to
                improve student outcomes.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  as={Link}
                  to="/signup"
                  size="lg"
                  variant="light"
                  className="px-5"
                  style={{
                    backgroundColor: "#f8fafc",
                    color: "#1e40af",
                    border: "none",
                    fontWeight: "600",
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  size="lg"
                  variant="outline-light"
                  className="px-5"
                  style={{ borderColor: "#cbd5e1", color: "#ffffff" }}
                >
                  Schedule Demo
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Landing;
