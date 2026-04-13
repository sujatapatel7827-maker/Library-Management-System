import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin({ setIsLogin }) {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const handleLogin = () => {
    if (data.username === "admin" && data.password === "1234") {
      localStorage.setItem("isLogin", "true");
      navigate("/home"); 
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Admin Login</h2>

        <input
          placeholder="Username"
          value={data.username}
          onChange={(e) =>
            setData({ ...data, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
