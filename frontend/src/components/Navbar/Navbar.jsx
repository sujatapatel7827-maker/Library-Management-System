import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaHome, FaChartBar, FaUser, FaList, FaFileAlt, FaChair } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();

  // ✅ Dashboard section ke ALL routes
  const isDashboardActive =
    location.pathname.startsWith("/home/dashboard") ||
    location.pathname.startsWith("/home/student") ||
    location.pathname.startsWith("/home/reports");

  return (
    <div className="sidebar">
      <h2 className="logo">Admin Panel</h2>

      <div className="nav-links">
        <NavLink to="/home" end>
          Home  <FaHome className="nav-icon" />
        </NavLink>

        <NavLink to="/home/dashboard">
           Dashboard  <FaChartBar className="nav-icon" />
        </NavLink>

        {/* 👇 Submenu ONLY for dashboard section */}
        {isDashboardActive && (
          <div className="sub-links">
            <NavLink to="/home/student-correction">
              Student Correction  <FaUser className="nav-icon" />
            </NavLink>

            <NavLink to="/home/student-details">
              Student Details  <FaList className="nav-icon" />
            </NavLink>

            <NavLink to="/home/reports">
              Reports & Analytics  <FaFileAlt className="nav-icon" />
            </NavLink>
          </div>
        )}

        <NavLink to="/home/booking">
          Booking Form  <FaFileAlt className="nav-icon" />
        </NavLink>

        <NavLink to="/home/seats">
          Seat Layout  <FaChair className="nav-icon" />
        </NavLink>
      </div>
    </div>
  );
}
