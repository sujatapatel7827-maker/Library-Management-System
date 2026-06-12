import { useParams, useNavigate } from "react-router-dom";
import "./ViewStudent.css";

export default function ViewStudent({ students }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 Student find
  const student = students.find(
    (s) => s.id == id
  );

  if (!student) {
    return (
      <p style={{ color: "white", padding: "40px" }}>
        Student not found
      </p>
    );
  }

  // FEES LOGIC
 
let TOTAL_FEES = 0;

if (student.seatType === "Reserved") TOTAL_FEES = 5000;
else if (student.seatType === "Floating") TOTAL_FEES = 4000;
else if (student.seatType === "Night") TOTAL_FEES = 3000;

const paidFees = Number(student.studentFees || 0);
const pendingFees = TOTAL_FEES - paidFees;

let status = "Pending";
if (paidFees >= TOTAL_FEES) status = "Paid";

  return (
    <div className="view-wrapper">
      <h2 className="page-title">Student Details</h2>

      <div className="view-card">
        <div className="view-info">
          <p><b>Name:</b> {student.name}</p>
          <p><b>Gender:</b> {student.gender}</p>
          <p><b>Mobile:</b> {student.phoneNo}</p>

          <p><b>Seat Type:</b> {student.seatType}</p>
          {student.seatNo && (
            <p><b>Seat No:</b> {student.seatNo}</p>
          )}

          {student.lockerFees && (
            <p><b>Locker Fees:</b> ₹{student.lockerFees}</p>
          )}

          {/* FEES SECTION */}
          <hr />

          <p><b>Total Fees:</b> ₹{TOTAL_FEES}</p>
          <p><b>Fees Paid:</b> ₹{paidFees}</p>

          {pendingFees > 0 ? (
            <p style={{ color: "orange", fontWeight: "bold" }}>
              <b>Pending Fees:</b> ₹{pendingFees}
            </p>
          ) : (
            <p style={{ color: "lime", fontWeight: "bold" }}>
              <b>Pending Fees:</b> ₹0 (All Clear ✅)
            </p>
          )}

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color:
                  student.status === "Paid"
                    ? "lime"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {student.status}
            </span>
          </p>

          <hr />

          <p><b>Start Date:</b> {student.startDate}</p>
          <p><b>End Date:</b> {student.endDate}</p>
        </div>

        {/*BACK BUTTON */}
        <button
          className="btn-back"
          onClick={() =>
            navigate("/home/student-correction")
          }
        >
          Back
        </button>
      </div>
    </div>
  );
}
