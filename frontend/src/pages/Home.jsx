import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaChartBar, FaFileAlt, FaChair, FaDatabase, FaArrowRight } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSysModal, setShowSysModal] = useState(false);
  const showWelcome = location.pathname === "/home" || location.pathname === "/home/";

  return (
    <>
      <Navbar />

      {/* 🔥 SCROLL CONTAINER */}
      <div className="page-container">
        {showWelcome && (
          <div className="home-welcome-console">
            <div className="welcome-header">
              <h1>Library Management System</h1>
              <p>Admin Workspace Console &amp; Real-time Seat Booking Manager</p>
            </div>

            <div className="quick-cards-grid">
              <div className="quick-card" onClick={() => navigate("/home/dashboard")}>
                <div className="quick-card-icon icon-analytics"><FaChartBar /></div>
                <h3>Dashboard &amp; Analytics</h3>
                <p>View visual charts, monthly revenues, seat occupancy rates, and upcoming expiring watchlists.</p>
                <div className="quick-card-action">
                  <span>Go to Dashboard</span> <FaArrowRight />
                </div>
              </div>

              <div className="quick-card" onClick={() => navigate("/home/booking")}>
                <div className="quick-card-icon icon-booking"><FaFileAlt /></div>
                <h3>Seat &amp; Locker Booking</h3>
                <p>Register new students, assign available seat numbers, lockers, and trigger automated email confirmations.</p>
                <div className="quick-card-action">
                  <span>Open Booking Panel</span> <FaArrowRight />
                </div>
              </div>

              <div className="quick-card" onClick={() => navigate("/home/seats")}>
                <div className="quick-card-icon icon-map"><FaChair /></div>
                <h3>Interactive Seat Map</h3>
                <p>Check the live color-coded seat layout grid (Available, Occupied, Expiring) and click to manage bookings.</p>
                <div className="quick-card-action">
                  <span>View Seat Grid</span> <FaArrowRight />
                </div>
              </div>

              <div className="quick-card" onClick={() => setShowSysModal(true)}>
                <div className="quick-card-icon icon-db"><FaDatabase /></div>
                <h3>Database &amp; Services</h3>
                <p>Check H2/MySQL connection properties, email SMTP alert config, and global exception parameters.</p>
                <div className="quick-card-action">
                  <span>View System Config</span> <FaArrowRight />
                </div>
              </div>
            </div>

            <div className="welcome-console-footer">
              <p>💡 <b>Pro Tip:</b> Click on any <b>Available (Green)</b> seat inside the Interactive Seat Map to quickly register a booking with pre-filled seat numbers.</p>
            </div>

            {/* System Info Modal */}
            {showSysModal && (
              <div className="modal-overlay" onClick={() => setShowSysModal(false)}>
                <div className="modal-content sys-modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>⚙️ System Configurations &amp; Status</h3>
                    <button className="close-btn" onClick={() => setShowSysModal(false)}>&times;</button>
                  </div>
                  <div className="modal-body">
                    <div className="status-item">
                      <p><b>Database Service:</b></p>
                      <span className="status-badge-green">Active (MySQL Database)</span>
                      <p className="status-detail">Persistent MySQL database is active. Data is permanently saved to your local MySQL server.</p>
                      <div className="status-detail" style={{ margin: "8px 0", background: "rgba(0,0,0,0.2)", padding: "8px", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.8rem" }}>
                        <b>JDBC URL:</b> jdbc:mysql://localhost:3306/lms_db <br/>
                        <b>Username:</b> root (Password: root)
                      </div>
                    </div>
                    <hr style={{ margin: "14px 0", opacity: 0.1 }} />
                    <div className="status-item">
                      <p><b>Security &amp; JWT Filter:</b></p>
                      <span className="status-badge-green">Enforced (Stateless JWT)</span>
                      <p className="status-detail">Default Administrator seeded: `admin` / `1234`. Secured endpoints under `/api/students/**` and `/api/bookings/**` via HTTP Authorization Bearer headers.</p>
                    </div>
                    <hr style={{ margin: "12px 0", opacity: 0.1 }} />
                    <div className="status-item">
                      <p><b>Email SMTP Mailer:</b></p>
                      <span className="status-badge-orange">Fallback Mode Active</span>
                      <p className="status-detail">Runs safely using smtp.gmail.com. If your credentials are not set, emails are skipped gracefully without failing bookings.</p>
                    </div>
                    <hr style={{ margin: "12px 0", opacity: 0.1 }} />
                    <div className="status-item">
                      <p><b>Collision / Overlap Engine:</b></p>
                      <span className="status-badge-green">Online &amp; Validating</span>
                      <p className="status-detail">Checks JPQL overlap constraints before creating or updating seats and lockers.</p>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="modal-close-btn" onClick={() => setShowSysModal(false)}>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Outlet />
      </div>
    </>
  );
}
