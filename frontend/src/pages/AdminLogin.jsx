import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    if (!data.username || !data.password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);

    if (isRegistering) {
      try {
        await api.post("/api/auth/register", {
          username: data.username,
          password: data.password
        });
        // On successful registration, switch back to login mode automatically
        setIsRegistering(false);
        setError("Registration successful! Please login."); // Display as error box but used for success info briefly or maybe just alert
      } catch (err) {
        console.error("Registration failed:", err);
        setError(err.response?.data?.message || "Registration Failed");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await api.post("/api/auth/login", {
          username: data.username,
          password: data.password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("username", data.username);
        navigate("/home");
      } catch (err) {
        console.error("Login failed:", err);
        setError(err.response?.data?.message || "Invalid Username or Password");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>{isRegistering ? "Admin Register" : "Admin Login"}</h2>

        {error && <p className="login-error-msg" style={{ color: error.includes("successful") ? "#4ade80" : "#ff6b6b", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}

        <input
          placeholder="Username"
          value={data.username}
          onChange={(e) =>
            setData({ ...data, username: e.target.value })
          }
          disabled={loading}
        />

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={data.password}
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAuth();
            }}
          />
          <button 
            className="toggle-password-btn" 
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button onClick={handleAuth} disabled={loading}>
          {loading ? (isRegistering ? "Registering..." : "Logging in...") : (isRegistering ? "Register" : "Login")}
        </button>

        <p className="toggle-auth-mode" onClick={() => {
          setIsRegistering(!isRegistering);
          setError("");
        }} style={{ marginTop: "15px", cursor: "pointer", color: "#38bdf8", fontSize: "0.9rem", textAlign: "center" }}>
          {isRegistering ? "Already have an account? Login here" : "Don't have an account? Register here"}
        </p>
      </div>
    </div>
  );
}
