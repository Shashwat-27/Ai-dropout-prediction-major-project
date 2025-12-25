import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../state/AuthContext.jsx";

const API_URL = "http://localhost:5000/api/auth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [userId, setUserId] = useState("");
  const [passwordOrDob, setPasswordOrDob] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let res;

      /* ================= STUDENT ================= */
      if (role === "Student") {
        res = await axios.post(`${API_URL}/student-login`, {
          admission_id: userId,
          dob: passwordOrDob,
        });

        login({
          id: res.data.admission_id,
          role: "Student",
        });

        navigate("/student");
      }

      /* ================= MENTOR ================= */
      if (role === "Mentor") {
        res = await axios.post(`${API_URL}/mentor-login`, {
          mentor_id: userId,
          password: passwordOrDob,
        });

        login({
          id: userId,
          role: "Mentor",
        });

        navigate("/mentor");
      }

      /* ================= PSYCHOLOGIST ================= */
      if (role === "Psychologist") {
        res = await axios.post(`${API_URL}/psychologist-login`, {
          psych_id: userId,
          password: passwordOrDob,
        });

        login({
          id: userId,
          role: "Psychologist",
        });

        navigate("/psychologist");
      }

      /* ================= COLLEGE / ADMIN ================= */
      if (role === "College") {
        res = await axios.post(`${API_URL}/admin-login`, {
          username: userId,
          password: passwordOrDob,
        });

        login({
          id: userId,
          role: "College",
        });

        navigate("/college");
      }

    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <div className="centered">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Student</option>
            <option>Mentor</option>
            <option>Psychologist</option>
            <option>College</option>
          </select>
        </label>

        <label>
          {role === "Student" ? "Admission ID" : "User ID"}
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </label>

        <label>
          {role === "Student" ? "Date of Birth (YYYY-MM-DD)" : "Password"}
          <input
            type={role === "Student" ? "date" : "password"}
            value={passwordOrDob}
            onChange={(e) => setPasswordOrDob(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
