import "./Reports.css";
import {
  FaUsers,
  FaPercentage,
  FaMale,
  FaFemale,
  FaRupeeSign,
  FaCalendarTimes
} from "react-icons/fa";

export default function Reports({ students = [] }) {

  const totalStudents = students.length;
  const male = students.filter(s => s.gender === "Male").length;
  const female = students.filter(s => s.gender === "Female").length;

  const totalAmount = students.reduce(
    (sum, s) => sum + Number(s.studentFees || 0),
    0
  );

  const receivedAmount = students
    .filter(s => s.status === "Paid")
    .reduce((sum, s) => sum + Number(s.studentFees || 0), 0);

  const dueAmount = totalAmount - receivedAmount;

  const attendance = 76.5;

  const suspendMonth = 79;
  const suspend1to3 = 7;

  return (
    <div className="reports-page">
      <h1>Reports & Analytics</h1>

      <div className="stats-grid">

        <StatCard icon={<FaUsers />} title="Total Students" value={totalStudents} />
        <StatCard icon={<FaPercentage />} title="Attendance %" value={`${attendance}%`} />
        <StatCard icon={<FaMale />} title="Total Male" value={male} />
        <StatCard icon={<FaFemale />} title="Total Female" value={female} />

        <StatCard icon={<FaRupeeSign />} title="Total Amount" value={`₹${totalAmount}`} />
        <StatCard icon={<FaRupeeSign />} title="Received Amount" value={`₹${receivedAmount}`} />
        <StatCard icon={<FaRupeeSign />} title="Due Amount" value={`₹${dueAmount}`} />

        <StatCard icon={<FaCalendarTimes />} title="Suspend (Month)" value={suspendMonth} />
        <StatCard icon={<FaCalendarTimes />} title="Suspend 1–3 Days" value={suspend1to3} />

      </div>
    </div>
  );
}

/* 🔹 CARD COMPONENT */
function StatCard({ icon, title, value }) {
  return (
    <div className="icon-card">
      <div className="icon-box">{icon}</div>

      <div className="card-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}
