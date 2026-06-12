import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api";
import "./UpdateStudent.css";

export default function UpdateStudent({ students, setStudents }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const oldStudent = students.find(
    (s) => s.id == id
  );

  const [data, setData] = useState(oldStudent);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!oldStudent) {
    return <p style={{ color: "white" }}>Student not found</p>;
  }

  const updateStudent = async () => {
    setErrorMsg("");
    // STATUS LOGIC
    let TOTAL_FEES = 0;
    if (data.seatType === "Reserved") TOTAL_FEES = 5000;
    else if (data.seatType === "Floating") TOTAL_FEES = 4000;
    else if (data.seatType === "Night") TOTAL_FEES = 3000;

    const status =
      Number(data.studentFees) >= TOTAL_FEES
        ? "Paid"
        : "Pending";

    const studentToUpdate = { ...data, status };

    try {
      const res = await api.put(`/api/students/${id}`, studentToUpdate);
      const savedStudent = res.data;

      const updatedStudents = students.map((s) =>
        s.id == id ? savedStudent : s
      );

      setStudents(updatedStudents);
      localStorage.setItem("students", JSON.stringify(updatedStudents));
      setSuccess(true);

      setTimeout(() => {
        navigate("/home/student-correction");
      }, 1200);
    } catch (error) {
      console.error("Update failed:", error);
      const message = error.response?.data?.message || "Update fail ho gaya. Details check karein.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="update-wrapper">
      <div className="update-card">
        <h2>Update Student</h2>

        {success && (
          <p className="success-msg">✅ Update successful</p>
        )}

        {errorMsg && (
          <p className="error-msg" style={{ color: "#ff6b6b", textAlign: "center", fontWeight: "bold", marginBottom: "15px" }}>
            {errorMsg}
          </p>
        )}

        <input
          placeholder="Name"
          value={data.name}
          onChange={(e) =>
            setData({ ...data, name: e.target.value })
          }
        />

        <select
          value={data.gender}
          onChange={(e) =>
            setData({ ...data, gender: e.target.value })
          }
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          placeholder="Mobile Number"
          type="number"
          value={data.phoneNo}
          onChange={(e) =>
            setData({ ...data, phoneNo: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Student Fees"
          value={data.studentFees}
          onChange={(e) =>
            setData({ ...data, studentFees: e.target.value })
          }
        />

        <select
          value={data.seatType}
          onChange={(e) =>
            setData({ ...data, seatType: e.target.value })
          }
        >
          <option value="">Select Seat Type</option>
          <option value="Reserved">Reserved</option>
          <option value="Floating">Floating</option>
          <option value="Night">Night</option>
        </select>

        {data.seatType === "Reserved" && (
          <input
            placeholder="Seat No"
            value={data.seatNo || ""}
            onChange={(e) =>
              setData({ ...data, seatNo: e.target.value })
            }
          />
        )}

        <input
          type="date"
          value={data.startDate}
          onChange={(e) =>
            setData({ ...data, startDate: e.target.value })
          }
        />

        <input
          type="date"
          value={data.endDate}
          onChange={(e) =>
            setData({ ...data, endDate: e.target.value })
          }
        />

        <div className="btn-group">
          <button className="btn-update" onClick={updateStudent}>
            Update
          </button>

          <button
            className="btn-cancel"
            onClick={() =>
              navigate("/home/student-correction")
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
