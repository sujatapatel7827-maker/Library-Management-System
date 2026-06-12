import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./Dashboard.css";
import "./StudentDetails.css";

export default function StudentCorrection({ students }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!students || students.length === 0) {
    return (
      <p style={{ color: "white", textAlign: "center" }}>
        No student found
      </p>
    );
  }

  const filteredStudents = searchQuery
    ? students.filter(
        (s) => {
          const terms = searchQuery.toLowerCase().split(/[\s,]+/).filter(Boolean);
          return terms.every(term =>
            s.name?.toLowerCase().includes(term) ||
            s.phoneNo?.includes(term) ||
            s.seatNo?.toString().includes(term) ||
            s.regNo?.toString().includes(term)
          );
        }
      )
    : students;

  return (
    <div className="student-correction-wrapper">
      <h1 className="page-heading">Student Records Management</h1>

      <div className="search-container" style={{ marginBottom: "25px", width: "900px", maxWidth: "100%", justifyContent: "flex-start" }}>
        <FaSearch className="search-icon" style={{ left: "14px" }} />
        <input
          type="text"
          placeholder="Search Name or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          style={{ width: "280px" }}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p style={{ color: "#9ca3af", textAlign: "center", fontSize: "16px" }}>
          No records match your search.
        </p>
      ) : (
        filteredStudents.map((s) => (
        <div className="student-card horizontal" key={s.id}>

          {/* LEFT SIDE : STUDENT INFO */}
          <div className="student-left">
            <h2 className="student-name">{s.name}</h2>

            <p><b>Gender:</b> {s.gender}</p>
            <p><b>Mobile:</b> {s.phoneNo}</p>

            <p><b>Seat Type:</b> {s.seatType}</p>
            {s.seatNo && (
              <p><b>Seat No:</b> {s.seatNo}</p>
            )}

            {s.lockerFees && (
              <p><b>Locker Fees:</b> ₹{s.lockerFees}</p>
            )}

            <p><b>Fees Paid:</b> ₹{s.studentFees}</p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color: s.status === "Paid" ? "lime" : "orange",
                  fontWeight: "bold",
                }}
              >
                {s.status}
              </span>
            </p>

            <p><b>From:</b> {s.startDate}</p>
            <p><b>To:</b> {s.endDate}</p>
          </div>

          {/* RIGHT SIDE : ACTION BUTTONS */}
          <div className="student-actions">
            <button
              className="btn view"
              onClick={() => navigate(`/home/view/${s.id}`)}
            >
              View
            </button>

            <button
              className="btn edit"
              onClick={() => navigate(`/home/edit/${s.id}`)}
            >
              Edit
            </button>

            <button
              className="btn delete"
              onClick={() => navigate(`/home/delete/${s.id}`)}
            >
              Delete
            </button>
          </div>
        </div>
        ))
      )}
    </div>
  );
}
