import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./StudentDetails.css";

export default function StudentDetails({ students }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!students || students.length === 0) {
    return <p style={{ color: "white", padding: "40px" }}>No students found</p>;
  }

  // 🔥 FILTER LOGIC
  let filteredStudents =
    filter === "All"
      ? students
      : students.filter(
          (s) =>
            s.seatType && s.seatType.toLowerCase() === filter.toLowerCase(),
        );

  if (searchQuery) {
    filteredStudents = filteredStudents.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phoneNo?.includes(searchQuery) ||
        s.seatNo?.toString().includes(searchQuery) ||
        s.regNo?.toString().includes(searchQuery)
    );
  }

  return (
    <div className="student-details-wrapper">
      <h2 className="page-title">Student Details</h2>

      {/* 🔥 FILTER & SEARCH BAR */}
      <div className="filter-bar">
        <div className="filter-buttons">
          {["All", "Reserved", "Floating", "Night"].map((type) => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? "active" : ""}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search Name, Phone, Seat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Reg. No</th>
              <th>Name</th>
              <th>Phone NO</th>
              <th>Gender</th>
              <th>Validity</th>
              <th>Shift</th>
              <th>SeatType</th>
              <th>SeatNo</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s, index) => {
              const isActive = new Date(s.endDate) >= new Date();

              return (
                <tr key={s.id}>
                  <td>{s.regNo || index + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.phoneNo || "-"}</td>
                  <td>{s.gender || "-"}</td>

                  <td>
                    {s.startDate} - {s.endDate}
                  </td>

                  <td>{s.shift || "24 Hour"}</td>
                  <td>{s.seatType}</td>
                  <td>{s.seatNo || "-"}</td>

                  <td>
                    <span
                      className={isActive ? "status active" : "status expired"}
                    >
                      {isActive ? "Active" : "Expired"}
                    </span>
                  </td>

                  <td className="action-btns">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/home/view/${s.id}`)}
                    >
                      👁
                    </button>

                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/home/edit/${s.id}`)}
                    >
                      ✏
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
