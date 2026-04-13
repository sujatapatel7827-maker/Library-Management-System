import "./BookingForm.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import myImage from "../../assets/cute-cartoon-girl.png";

export default function BookingForm({ students, setStudents }) {
  const [booking, setBooking] = useState({
    name: "",
    gender: "",
    phoneNo: "",
    studentFees: "",
    seatType: "",
    seatNo: "",
    lockerFees: "",
    lockerNo: "",
    startDate: "",
    endDate: "",
    status: ""
  });

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM SUBMITTED", booking);

  let TOTAL_FEES = 0;

if (booking.seatType === "Reserved") TOTAL_FEES = 5000;
else if (booking.seatType === "Floating") TOTAL_FEES = 4000;
else if (booking.seatType === "Night") TOTAL_FEES = 3000;

let paid = Number(booking.studentFees) || 0;

let paymentStatus = paid >= TOTAL_FEES ? "Paid" : "Pending";

    // STUDENT DATA
    const studentData = {
      name: booking.name,
      mobile: booking.phoneNo,
      fees: booking.studentFees,
      seatType: booking.seatType // important
    };

    try {
      //SAVE STUDENT
      const res = await axios.post(
        "http://localhost:5000/api/students",
        studentData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const savedStudent = res.data;

      // BOOKING DATA
      const bookingData = {
        seatNo: Number(booking.seatNo || 1), 
        startDate: booking.startDate,
        expiryDate: booking.endDate,
        days: 30,
        status: paymentStatus,
        seatType: booking.seatType, 
        student: {
          id: savedStudent.id
        }
      };

      // SAVE BOOKING
      await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Booking Saved ");

      // frontend update
      const newData = {
        ...booking,
        status: paymentStatus,
        id: Date.now(),
      };

      setStudents(prev => [...prev, newData]);

      localStorage.setItem(
        "students",
        JSON.stringify([...students, newData])
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/home/dashboard");
      }, 1500);

    } catch (error) {
      console.error("FULL ERROR:", error);
      console.log("STATUS:", error?.response?.status);
      console.log("DATA:", error?.response?.data);
      alert("Data save nahi hua ");
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

            {/*Always show seatNo */}
            <input
              placeholder="Seat No"
              value={booking.seatNo}
              onChange={(e) =>
                setBooking({ ...booking, seatNo: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Locker Fees"
              value={booking.lockerFees}
              onChange={(e) =>
                setBooking({ ...booking, lockerFees: e.target.value })
              }
            />

            <input
              placeholder="Locker Number"
              value={booking.lockerNo}
              onChange={(e) =>
                setBooking({ ...booking, lockerNo: e.target.value })
              }
            />

            <input
              type="date"
              value={booking.startDate}
              onChange={(e) =>
                setBooking({ ...booking, startDate: e.target.value })
              }
              required
            />

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