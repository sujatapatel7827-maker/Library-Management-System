import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import { FaHome, FaChartBar, FaUser, FaList, FaFileAlt, FaChair, FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

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
          <span className="nav-text">Home</span>  <FaHome className="nav-icon" />
        </NavLink>

        <NavLink to="/home/dashboard">
           <span className="nav-text">Dashboard</span>  <FaChartBar className="nav-icon" />
        </NavLink>

        {/* 👇 Submenu ONLY for dashboard section */}
        <div className="sub-links">
          <NavLink to="/home/student-correction">
            <span className="nav-text">Student Correction</span>  <FaUser className="nav-icon" />
          </NavLink>

          <NavLink to="/home/student-details">
            <span className="nav-text">Student Details</span>  <FaList className="nav-icon" />
          </NavLink>

          <NavLink to="/home/reports">
            <span className="nav-text">Reports & Analytics</span>  <FaFileAlt className="nav-icon" />
          </NavLink>
        </div>

        <NavLink to="/home/booking">
          <span className="nav-text">Booking Form</span>  <FaFileAlt className="nav-icon" />
        </NavLink>

        <NavLink to="/home/seats">
          <span className="nav-text">Seat Layout</span>  <FaChair className="nav-icon" />
        </NavLink>
      </div>
    </div>
  );
}
