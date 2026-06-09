import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  FaUserCheck, FaMoneyBillWave, FaChair, FaExclamationTriangle, 
  FaUserCog, FaAddressBook, FaChartBar, FaSignOutAlt 
} from "react-icons/fa";
import "./Dashboard.css";
import myImage from "../../assets/cute-cartoon-girl.png";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

export default function Dashboard({ students = [] }) {
  const navigate = useNavigate();
  const [totalSeats, setTotalSeats] = useState(15);

  useEffect(() => {
    const savedSeats = localStorage.getItem("totalSeats");
    if (savedSeats) {
      setTotalSeats(Number(savedSeats));
    }
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compute active bookings (endDate >= today)
  const activeStudents = students.filter(s => {
    if (!s.endDate) return false;
    try {
      const end = new Date(s.endDate + "T23:59:59");
      return end >= today;
    } catch (e) {
      return false;
    }
  });

  // Calculate active seat occupancy
  const occupiedSeatsCount = activeStudents.filter(s => s.seatNo).length;
  const occupancyRate = totalSeats > 0 ? ((occupiedSeatsCount / totalSeats) * 100).toFixed(1) : 0;

  // Calculate total active revenue
  const totalRevenue = activeStudents.reduce((acc, curr) => {
    const fees = (Number(curr.studentFees) || 0) + (Number(curr.lockerFees) || 0);
    return acc + fees;
  }, 0);

  // Calculate expiring bookings in the next 7 days
  const expiringStudents = activeStudents.filter(s => {
    try {
      const end = new Date(s.endDate + "T00:00:00");
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    } catch (e) {
      return false;
    }
  });

  // Recharts Monthly Revenue calculations
  const getMonthlyRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueMap = {};

    students.forEach(s => {
      if (s.startDate) {
        try {
          const date = new Date(s.startDate);
          const monthName = months[date.getMonth()];
          const fee = (Number(s.studentFees) || 0) + (Number(s.lockerFees) || 0);
          revenueMap[monthName] = (revenueMap[monthName] || 0) + fee;
        } catch (e) {}
      }
    });

    const currentMonthIndex = today.getMonth();
    return months
      .map((m, index) => ({
        name: m,
        Revenue: revenueMap[m] || 0,
        index
      }))
      // Show up to the current month, or months that have positive revenue
      .filter(item => item.Revenue > 0 || item.index <= currentMonthIndex);
  };

  // Recharts Seat Type distribution
  const getSeatTypeData = () => {
    let reserved = 0;
    let floating = 0;
    let night = 0;

    activeStudents.forEach(s => {
      if (s.seatType === "Reserved") reserved++;
      else if (s.seatType === "Floating") floating++;
      else if (s.seatType === "Night") night++;
    });

    const data = [
      { name: "Reserved", value: reserved },
      { name: "Floating", value: floating },
      { name: "Night", value: night }
    ];

    // If no active bookings, provide subtle mock data for illustration
    if (reserved === 0 && floating === 0 && night === 0) {
      return [
        { name: "Reserved", value: 1 },
        { name: "Floating", value: 1 },
        { name: "Night", value: 1 }
      ];
    }

    return data.filter(item => item.value > 0);
  };

  const revenueData = getMonthlyRevenueData();
  const seatTypeData = getSeatTypeData();

  return (
    <div className="dashboard-hero">
      {/* Navigation Headers */}
      <div className="top-nav">
        <span onClick={() => navigate("/home/student-correction")}>
          <FaUserCog /> Student Correction
        </span>
        <span onClick={() => navigate("/home/student-details")}>
          <FaAddressBook /> Student Details
        </span>
        <span onClick={() => navigate("/home/reports")}>
          <FaChartBar /> Reports
        </span>
        <span
          onClick={() => {
            localStorage.removeItem("isLogin");
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="logout-btn-nav"
        >
          <FaSignOutAlt /> Logout
        </span>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="analytics-grid">
        <div className="analytics-card card-revenue">
          <div className="card-icon"><FaMoneyBillWave /></div>
          <div className="card-info">
            <h4>Total Active Revenue</h4>
            <h3>₹{totalRevenue.toLocaleString()}</h3>
            <p>Active Seat & Locker fees</p>
          </div>
        </div>

        <div className="analytics-card card-occupancy">
          <div className="card-icon"><FaChair /></div>
          <div className="card-info">
            <h4>Seat Occupancy</h4>
            <h3>{occupancyRate}%</h3>
            <p>{occupiedSeatsCount} of {totalSeats} seats filled</p>
          </div>
        </div>

        <div className="analytics-card card-active">
          <div className="card-icon"><FaUserCheck /></div>
          <div className="card-info">
            <h4>Active Bookings</h4>
            <h3>{activeStudents.length}</h3>
            <p>Students currently studying</p>
          </div>
        </div>

        <div className="analytics-card card-expiring">
          <div className="card-icon"><FaExclamationTriangle /></div>
          <div className="card-info">
            <h4>Expiring Soon</h4>
            <h3>{expiringStudents.length}</h3>
            <p>Bookings expiring in 7 days</p>
          </div>
        </div>
      </div>

      {/* Visual Charts Container */}
      <div className="charts-container">
        <div className="chart-box revenue-chart">
          <h3>Monthly Revenue Analysis</h3>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} 
                  labelStyle={{ color: "#fff" }} 
                />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box type-chart">
          <h3>Seat Subscriptions</h3>
          <div style={{ width: "100%", height: 280 }} className="pie-container">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={seatTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {seatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Watchlist Table */}
      <div className="watchlist-section">
        <div className="watchlist-header">
          <h3>⚠️ Upcoming Expiring Bookings Watchlist</h3>
          <span className="badge-alert">{expiringStudents.length} alert(s)</span>
        </div>
        
        {expiringStudents.length === 0 ? (
          <p className="no-alerts-msg">🎉 Awesome! No seat bookings expiring in the next 7 days.</p>
        ) : (
          <div className="watchlist-table-wrapper">
            <table className="watchlist-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Seat Details</th>
                  <th>Locker details</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiringStudents.map(student => {
                  const end = new Date(student.endDate + "T00:00:00");
                  const diffTime = end.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={student.id} className={diffDays <= 2 ? "critical-alert" : ""}>
                      <td>
                        <div className="name-cell">
                          <span className="avatar-dot"></span>
                          {student.name}
                        </div>
                      </td>
                      <td>Seat #{student.seatNo} ({student.seatType})</td>
                      <td>{student.lockerNo ? `Locker #${student.lockerNo}` : "No Locker"}</td>
                      <td>{student.startDate}</td>
                      <td>
                        <span className={`expiry-tag ${diffDays <= 2 ? "critical" : "warning"}`}>
                          {student.endDate} ({diffDays === 0 ? "Today" : `${diffDays} days left`})
                        </span>
                      </td>
                      <td>
                        <button className="watchlist-action-btn" onClick={() => navigate(`/home/view/${student.id}`)}>
                          Profile
                        </button>
                        <button className="watchlist-action-btn edit" onClick={() => navigate(`/home/edit/${student.id}`)}>
                          Renew
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Greeting Banner */}
      <div className="hero-wrapper dashboard-welcome-footer">
        <div className="hero-content">
          <h2>Quick Actions Panel</h2>
          <p>Easily edit bookings, assign empty seats via the seat map, or compile monthly fee reports.</p>
        </div>
        <div className="hero-image">
          <img src={myImage} alt="admin" style={{ width: "180px" }} />
        </div>
      </div>
    </div>
  );
}

