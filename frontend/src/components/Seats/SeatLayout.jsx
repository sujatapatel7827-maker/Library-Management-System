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
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // seat numbers
  const seatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1);

  // localStorage me save (refresh ke baad bhi rahe)
  useEffect(() => {
    localStorage.setItem("totalSeats", totalSeats);
  }, [totalSeats]);

  // 🔹 seat layout build
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tempSeats = seatNumbers.map((num) => {
      // Find active booking for this seat (any seatType)
      const student = students.find(
        (s) =>
          s.seatNo &&
          Number(s.seatNo) === num &&
          s.endDate &&
          new Date(s.endDate + "T23:59:59") >= today
      );

      let status = "empty";
      let studentName = null;
      let studentId = null;
      let studentEmail = null;
      let studentPhone = null;
      let seatType = null;
      let startDate = null;
      let endDate = null;
      let lockerNo = null;

      if (student) {
        studentName = student.name;
        studentId = student.id;
        studentEmail = student.email;
        studentPhone = student.phoneNo;
        seatType = student.seatType;
        startDate = student.startDate;
        endDate = student.endDate;
        lockerNo = student.lockerNo;

        // Check if expiring in next 3 days
        const end = new Date(student.endDate + "T00:00:00");
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 3) {
          status = "expiring";
        } else {
          status = "active";
        }
      }

      return {
        seatNo: num,
        status,
        studentName,
        studentId,
        studentEmail,
        studentPhone,
        seatType,
        startDate,
        endDate,
        lockerNo
      };
    });

    setSeats(tempSeats);
  }, [students, totalSeats]);

  // Increment seat
  const incrementSeats = () => {
    setTotalSeats((prev) => prev + 1);
  };

  // Decrement seat (active seat delete nahi hogi)
  const decrementSeats = () => {
    const lastSeat = seats.find((s) => s.seatNo === totalSeats);

    if (lastSeat?.status !== "empty") {
      alert("Active/Expiring seat cannot be removed");
      return;
    }

    if (totalSeats > 1) {
      setTotalSeats((prev) => prev - 1);
    }
  };

  // seat click
  const handleSeatClick = (seat) => {
    if (seat.status === "empty") {
      // Navigate to booking panel and prefill the seatNo
      navigate(`/home/booking?seatNo=${seat.seatNo}&seatType=Reserved`);
    } else {
      // Show details modal for occupied seat
      setSelectedSeat(seat);
      setShowModal(true);
    }
  };

  return (
    <div className="seat-page">
      <h2 className="seat-heading">Interactive Seat Layout</h2>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <span className="dot green"></span> Available (Empty)
        </div>
        <div className="legend-item">
          <span className="dot red"></span> Occupied (Booked)
        </div>
        <div className="legend-item">
          <span className="dot yellow"></span> Expiring Soon (&le; 3 Days)
        </div>
      </div>

      {/* Seat Cards */}
      <div className="seat-card-wrapper">
        <div className="seat-card-container">
          {seats.map((seat) => (
            <div
              key={seat.seatNo}
              className={`seat-card ${
                seat.status === "empty" ? "green" : seat.status === "expiring" ? "yellow" : "red"
              }`}
              onClick={() => handleSeatClick(seat)}
              style={{ cursor: "pointer" }}
            >
              <div className="seat-number">Seat {seat.seatNo}</div>
              {seat.studentName && (
                <div className="student-name">{seat.studentName}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="seat-controls bottom-center">
        <button onClick={decrementSeats}>➖</button>
        <span>Total Seats: {totalSeats}</span>
        <button onClick={incrementSeats}>➕</button>
      </div>

      {/* Student Details Modal */}
      {showModal && selectedSeat && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Seat {selectedSeat.seatNo} Booking Info</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><b>Name:</b> {selectedSeat.studentName}</p>
              <p><b>Email:</b> {selectedSeat.studentEmail || "Not Provided"}</p>
              <p><b>Phone:</b> {selectedSeat.studentPhone}</p>
              <p><b>Seat Type:</b> {selectedSeat.seatType}</p>
              <p><b>Locker assigned:</b> {selectedSeat.lockerNo ? `Locker #${selectedSeat.lockerNo}` : "None"}</p>
              <p><b>Booking Start:</b> {selectedSeat.startDate}</p>
              <p><b>Booking End:</b> {selectedSeat.endDate}</p>
              <span className={`badge ${selectedSeat.status === "expiring" ? "expiring-badge" : "active-badge"}`}>
                {selectedSeat.status === "expiring" ? "Expiring Soon!" : "Active Booking"}
              </span>
            </div>
            <div className="modal-footer">
              <button className="modal-action-btn" onClick={() => navigate(`/home/view/${selectedSeat.studentId}`)}>
                View Full Profile
              </button>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

