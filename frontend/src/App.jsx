import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./api";

import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import Dashboard from "./components/Deshboard/Dashboard";
import StudentCorrection from "./components/Deshboard/StudentCorrection";
import StudentDetails from "./components/Deshboard/StudentDetails";
import BookingForm from "./components/BookingForm/BookingForm";
import ViewStudent from "./components/Students/ViewStudent";
import UpdateStudent from "./components/Students/UpdateStudent";
import DeleteStudent from "./components/Students/DeleteStudent";
import Reports from "./components/Reports/Reports";
import SeatLayout from "./components/Seats/SeatLayout";

/* 🔐 AUTH GUARD */
const RequireAuth = ({ children }) => {
  const isLogin = localStorage.getItem("isLogin") === "true";
  return isLogin ? children : <Navigate to="/" replace />;
};

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/api/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        // Fallback to localStorage if API fails
        const savedStudents = JSON.parse(localStorage.getItem("students"));
        if (savedStudents) setStudents(savedStudents);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="shimmer-wrapper">
        <div className="skeleton-box title"></div>
        <div className="skeleton-box card"></div>
        <div style={{ display: "flex", gap: "20px", width: "100%", maxWidth: "800px" }}>
          <div className="skeleton-box" style={{ height: "100px", flex: 1 }}></div>
          <div className="skeleton-box" style={{ height: "100px", flex: 1 }}></div>
        </div>
        <div className="skeleton-box" style={{ height: "80px" }}></div>
        <div className="skeleton-box" style={{ height: "80px" }}></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<AdminLogin />} />

      {/* HOME + SIDEBAR LAYOUT */}
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      >
        {/* DASHBOARD */}
        <Route path="dashboard" element={<Dashboard students={students} />} />

        {/* DASHBOARD OPTIONS */}
        <Route
          path="student-correction"
          element={<StudentCorrection students={students} />}
        />

        <Route
          path="student-details"
          element={<StudentDetails students={students} />}
        />

        <Route
          path="reports"
          element={<Reports students={students} />}
        />

        {/* OTHER MODULES */}
        <Route
          path="booking"
          element={
            <BookingForm
              students={students}
              setStudents={setStudents}
            />
          }
        />

        <Route
          path="seats"
          element={<SeatLayout students={students} />}
        />

        {/* STUDENT ACTIONS */}
        <Route
          path="view/:id"
          element={<ViewStudent students={students} />}
        />

        <Route
          path="edit/:id"
          element={
            <UpdateStudent
              students={students}
              setStudents={setStudents}
            />
          }
        />

        <Route
          path="delete/:id"
          element={
            <DeleteStudent
              students={students}
              setStudents={setStudents}
            />
          }
        />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
