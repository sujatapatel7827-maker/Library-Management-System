import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "./DeleteStudent.css";

export default function DeleteStudent({ students, setStudents }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const student = students.find(s => s.id == id);

  if (!student) {
    return (
      <p style={{ color: "white", padding: "40px" }}>
        Student not found
      </p>
    );
  }

  const deleteStudent = async () => {
    try {
      await api.delete(`/api/students/${id}`);

      const updatedStudents = students.filter((s) => s.id != id);

      setStudents(updatedStudents);
      localStorage.setItem("students", JSON.stringify(updatedStudents));

      // ✅ AFTER DELETE → Student Correction
      navigate("/home/student-correction");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="delete-wrapper">
      <div className="delete-card">
        <h2>Delete Confirmation</h2>

        <p className="delete-text">
          Are you sure you want to delete the record of
          <b> {student.name}</b>?
        </p>

        <div className="delete-actions">
          <button className="btn-delete" onClick={deleteStudent}>
            Yes, Delete
          </button>

          <button
            className="btn-cancel"
            onClick={() => navigate("/home/student-correction")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
