import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./state/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";


import MentorPage from "./pages/dashboard/MentorPage.jsx";
import CollegePage from "./pages/dashboard/CollegePage.jsx";
import PsychologistPage from "./pages/dashboard/PsychologistPage.jsx";
import StudentPage from "./pages/dashboard/StudentPage.jsx";

// 🔐 Protected Route Component
function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();

  // ⏳ Wait for auth hydration
  if (loading) {
    return null; // or loader
  }

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}


function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}

          {/* Role-Based Protected Routes */}
          <Route
            path="/mentor"
            element={
              <PrivateRoute roles={["Mentor"]}>
                <MentorPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/college"
            element={
              <PrivateRoute roles={["College"]}>
                <CollegePage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/psychologist"
            element={
              <PrivateRoute roles={["Psychologist"]}>
                <PsychologistPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/student"
            element={
              <PrivateRoute roles={["Student"]}>
                <StudentPage />
              </PrivateRoute>
            }
          />
          

          {/* Catch-All → redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
