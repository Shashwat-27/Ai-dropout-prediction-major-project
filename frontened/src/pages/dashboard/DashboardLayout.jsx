import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";

function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="avatar" aria-hidden></div>
          <div>
            <div className="sidebar-name">{user?.name || "User"}</div>
            <div className="sidebar-role">{user?.role}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/mentor">Mentor</NavLink>
          <NavLink to="/dashboard/college">College</NavLink>
          <NavLink to="/dashboard/psychologist">Psychologist</NavLink>
        </nav>
      </aside>
      <section className="dashboard-content">
        <Outlet />
      </section>
    </div>
  );
}

export default DashboardLayout;
