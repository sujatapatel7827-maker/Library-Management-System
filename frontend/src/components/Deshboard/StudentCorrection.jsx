import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function StudentCorrection({ students }) {
  const navigate = useNavigate();

  if (!students || students.length === 0) {
    return (
      <p style={{ color: "white", textAlign: "center" }}>
        No student found
      </p>
    );
  }

  return (
    <div className="student-correction-wrapper">
      <h1 className="page-heading">Student Records Management</h1>
      {students.map((s) => (
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
      ))}
    </div>
  );
}
