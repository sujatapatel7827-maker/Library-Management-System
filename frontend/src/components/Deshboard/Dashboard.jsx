import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import myImage from "../../assets/cute-cartoon-girl.png";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-hero">
      {/* 🔥 TOP NAV (UPDATED – SAME CLASS) */}
      <div className="top-nav">
        <span onClick={() => navigate("/home/student-correction")}>
          Student Correction
        </span>

        <span onClick={() => navigate("/home/student-details")}>
          Student Details
        </span>

        <span onClick={() => navigate("/home/reports")}>Reports</span>

        <span
          onClick={() => {
            localStorage.removeItem("isLogin");
            navigate("/");
          }}
        >
          Logout
        </span>
      </div>

      {/* CONTENT WRAPPER ADD KIYA */}
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1>Welcome to Admin Dashboard</h1>

          <p>
            Welcome to the <span>Library Management System</span> !
          </p>

          <p>Here, you can efficiently manage employee records.</p>

          <p>
            <b>Perform CRUD operations:</b>
          </p>

          <p>Create, Read, Update, and Delete records seamlessly.</p>

          <p>Experience a smooth and secure interface.</p>
        </div>

        <div className="hero-image">
          <img src={myImage} alt="admin" />
        </div>
      </div>
    </div>
  );
}
