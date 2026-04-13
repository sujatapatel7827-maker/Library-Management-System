import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SeatLayout.css";

export default function SeatLayout({ students = [] }) {
  const navigate = useNavigate();

  // totalSeats → localStorage se load hoga
  const [totalSeats, setTotalSeats] = useState(() => {
    const savedSeats = localStorage.getItem("totalSeats");
    return savedSeats ? Number(savedSeats) : 15;
  });

  const [seats, setSeats] = useState([]);

  // seat numbers
  const seatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1);

  // localStorage me save (refresh ke baad bhi rahe)
  useEffect(() => {
    localStorage.setItem("totalSeats", totalSeats);
  }, [totalSeats]);

  // 🔹 seat layout build
  useEffect(() => {
    const today = new Date();

    const tempSeats = seatNumbers.map((num) => {
      const student = students.find(
  (s) =>
    ["Reserved", "Floating", "Night"].includes(s.seatType) &&
    Number(s.seatNo) === num &&
    new Date(s.endDate) >= today
);

      return {
        seatNo: num,
        status: student ? "active" : "empty",
        studentName: student ? student.name : null,
        studentId: student ? student.id : null,
      };
    });

    setSeats(tempSeats);
  }, [students, totalSeats]);

  //Increment seat
  const incrementSeats = () => {
    setTotalSeats((prev) => prev + 1);
  };

  // Decrement seat (active seat delete nahi hogi)
  const decrementSeats = () => {
    const lastSeat = seats.find((s) => s.seatNo === totalSeats);

    if (lastSeat?.status === "active") {
      alert("Active seat cannot be removed");
      return;
    }

    if (totalSeats > 1) {
      setTotalSeats((prev) => prev - 1);
    }
  };

  // seat click
  const handleSeatClick = (seat) => {
    if (seat.status === "active" && seat.studentId) {
      navigate(`/home/view/${seat.studentId}`);
    }
  };

  return (
    <div className="seat-page">
      <h2 className="seat-heading">Seat Layout</h2>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <span className="dot green"></span> Active
        </div>
        <div className="legend-item">
          <span className="dot red"></span> Empty
        </div>
      </div>

      {/* Seat Cards */}
      <div className="seat-card-wrapper">
        <div className="seat-card-container">
          {seats.map((seat) => (
            <div
              key={seat.seatNo}
              className={`seat-card ${
                seat.status === "active" ? "green" : "red"
              }`}
              onClick={() => handleSeatClick(seat)}
              style={{
                cursor:
                  seat.status === "active" ? "pointer" : "not-allowed",
              }}
            >
              <div className="seat-number">Seat {seat.seatNo}</div>

              {seat.status === "active" && (
                <div className="student-name">{seat.studentName}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/*Controls */}
      <div className="seat-controls bottom-center">
        <button onClick={decrementSeats}>➖</button>
        <span>Total Seats: {totalSeats}</span>
        <button onClick={incrementSeats}>➕</button>
      </div>
    </div>
  );
}
