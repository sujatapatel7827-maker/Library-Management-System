import "./BookingForm.css";
import api from "../../api";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import myImage from "../../assets/cute-cartoon-girl.png";

export default function BookingForm({ students, setStudents }) {
  const navigate = useNavigate();
  const { search } = useLocation();

  const getInitialBookingState = () => {
    const savedBooking = localStorage.getItem("draftBooking");
    if (savedBooking) {
      return JSON.parse(savedBooking);
    }
    return {
      name: "",
      email: "",
      gender: "",
      phoneNo: "",
      studentFees: "",
      seatType: "",
      seatNo: "",
      startDate: "",
      endDate: "",
      status: ""
    };
  };

  const [booking, setBooking] = useState(getInitialBookingState);

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Read query parameters to pre-fill seat information from Seat Layout map
  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const seatNoParam = queryParams.get("seatNo");
    const seatTypeParam = queryParams.get("seatType");
    if (seatNoParam) {
      setBooking((prev) => ({
        ...prev,
        seatNo: seatNoParam,
        seatType: seatTypeParam || ""
      }));
    }
  }, [search]);

  // Save booking data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("draftBooking", JSON.stringify(booking));
  }, [booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    console.log("FORM SUBMITTED", booking);

    let TOTAL_FEES = 0;
    if (booking.seatType === "Reserved") TOTAL_FEES = 5000;
    else if (booking.seatType === "Floating") TOTAL_FEES = 4000;
    else if (booking.seatType === "Night") TOTAL_FEES = 3000;

    let paid = Number(booking.studentFees) || 0;
    let paymentStatus = paid >= TOTAL_FEES ? "Paid" : "Pending";

    const studentData = { ...booking, status: paymentStatus };

    try {
      // SAVE STUDENT using central api client
      const res = await api.post("/api/students", studentData);
      const savedStudent = res.data;

      console.log("Student and Booking Saved successfully");

      // frontend update
      setStudents(prev => [...prev, savedStudent]);

      const updatedStudents = [...students, savedStudent];
      localStorage.setItem("students", JSON.stringify(updatedStudents));
      localStorage.removeItem("draftBooking"); // Clear draft after successful submit

      setSuccess(true);
      setTimeout(() => {
        navigate("/home/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Booking failed:", error);
      const message = error.response?.data?.message || "Data save nahi hua. Seat check constraint check karein.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="booking-wrapper">
      <h1 className="page-heading">Seat Booking Panel</h1>

      <div className="booking-container">

        <div className="booking-image">
          <img src={myImage} alt="booking" />
        </div>

        <div className="booking-card">
          <h2>Seat Booking</h2>

          {success && (
            <p style={{ color: "lime", textAlign: "center" }}>
              Successfully Submitted
            </p>
          )}

          <form onSubmit={handleSubmit}>

            {errorMsg && (
              <p style={{ color: "#ff6b6b", textAlign: "center", fontWeight: "bold", margin: "10px 0" }}>
                {errorMsg}
              </p>
            )}

            <input
              placeholder="Student Name"
              value={booking.name}
              onChange={(e) =>
                setBooking({ ...booking, name: e.target.value })
              }
              required
            />

            <select
              value={booking.gender}
              onChange={(e) =>
                setBooking({ ...booking, gender: e.target.value })
              }
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              placeholder="Mobile Number"
              value={booking.phoneNo}
              onChange={(e) =>
                setBooking({ ...booking, phoneNo: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Student Fees"
              value={booking.studentFees}
              onChange={(e) =>
                setBooking({ ...booking, studentFees: e.target.value })
              }
              required
            />

            <select
              value={booking.seatType}
              onChange={(e) =>
                setBooking({ ...booking, seatType: e.target.value })
              }
              required
            >
              <option value="">Select Seat Type</option>
              <option value="Reserved">Reserved</option>
              <option value="Floating">Floating</option>
              <option value="Night">Night</option>
            </select>

            <input
              placeholder="Seat No"
              value={booking.seatNo}
              onChange={(e) =>
                setBooking({ ...booking, seatNo: e.target.value })
              }
              required
            />

            <div style={{textAlign: "left", color: "#aaa", fontSize: "14px", marginTop: "10px", marginBottom: "4px", paddingLeft: "4px"}}>Start Date</div>
            <input
              type="date"
              value={booking.startDate}
              onChange={(e) =>
                setBooking({ ...booking, startDate: e.target.value })
              }
              required
            />

            <div style={{textAlign: "left", color: "#aaa", fontSize: "14px", marginTop: "10px", marginBottom: "4px", paddingLeft: "4px"}}>End Date</div>
            <input
              type="date"
              value={booking.endDate}
              onChange={(e) =>
                setBooking({ ...booking, endDate: e.target.value })
              }
              required
            />

            <button type="submit">Submit</button>

          </form>
        </div>
      </div>
    </div>
  );
}