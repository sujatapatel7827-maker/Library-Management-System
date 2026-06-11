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

  const handleLogin = async () => {
    if (!data.username || !data.password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", {
        username: data.username,
        password: data.password
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("isLogin", "true");
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Admin Login</h2>

        {error && <p className="login-error-msg" style={{ color: "#ff6b6b", marginBottom: "15px", fontSize: "0.9rem" }}>{error}</p>}

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
              if (e.key === "Enter") handleLogin();
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

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
