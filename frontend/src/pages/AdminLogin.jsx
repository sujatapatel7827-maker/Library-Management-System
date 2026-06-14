import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    otpPreference: "email",
    otpCode: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleLogin = async () => {
    if (!data.username || !data.password) {
      setError("Please fill in all fields");
      return;
    }
    setError(""); setSuccess(""); setLoading(true);

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
      if (err.response?.status === 403) {
         // Account inactive, needs OTP
         setIsVerifyingOtp(true);
         setError("");
         setSuccess("Please verify your OTP to activate account.");
      } else {
         setError(err.response?.data?.message || "Invalid Username or Password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      setError("Please fill all required fields (Mobile is optional).");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (data.otpPreference === "mobile" && !data.mobileNumber) {
      setError("Mobile Number is required if you choose SMS OTP.");
      return;
    }

    setError(""); setSuccess(""); setLoading(true);
    try {
      const response = await api.post("/api/auth/register", {
        username: data.username,
        email: data.email,
        mobileNumber: data.mobileNumber,
        password: data.password,
        otpPreference: data.otpPreference
      });
      setSuccess(response.data.message || "OTP sent successfully!");
      setIsVerifyingOtp(true); // Move to OTP screen
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!data.otpCode || data.otpCode.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }
    setError(""); setSuccess(""); setLoading(true);
    try {
      const response = await api.post("/api/auth/verify-otp", {
        username: data.username,
        otpCode: data.otpCode
      });
      setSuccess(response.data.message || "Account activated! You can now login.");
      setIsVerifyingOtp(false);
      setIsRegistering(false); // Go back to login screen
      setData({ ...data, otpCode: "", password: "", confirmPassword: "" }); // Clear sensitive fields
    } catch (err) {
      console.error("Verification failed:", err);
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setIsVerifyingOtp(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>{isVerifyingOtp ? "Verify OTP" : isRegistering ? "Admin Register" : "Admin Login"}</h2>

        {error && <p className="login-error-msg" style={{ color: "#ff6b6b" }}>{error}</p>}
        {success && <p className="login-error-msg" style={{ color: "#4ade80" }}>{success}</p>}

        {isVerifyingOtp ? (
          <>
            <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "15px", textAlign: "center" }}>
              Enter the 4-digit OTP sent to your {data.otpPreference === "mobile" ? "mobile number" : "email"}.
            </p>
            <input
              name="otpCode"
              placeholder="Enter 4-Digit OTP"
              value={data.otpCode}
              onChange={handleChange}
              disabled={loading}
              maxLength="4"
              style={{ textAlign: "center", letterSpacing: "5px", fontSize: "1.2rem" }}
            />
            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Activate"}
            </button>
            <p className="toggle-auth-mode">
              <span className="auth-link" onClick={() => { setIsVerifyingOtp(false); setError(""); setSuccess(""); }}>Back to Login</span>
            </p>
          </>
        ) : isRegistering ? (
          <>
            <input name="username" placeholder="UserName" value={data.username} onChange={handleChange} disabled={loading} />
            <input name="email" type="email" placeholder="Email Address" value={data.email} onChange={handleChange} disabled={loading} />
            <input name="mobileNumber" placeholder="Mobile Number (Optional)" value={data.mobileNumber} onChange={handleChange} disabled={loading} />
            
            <div className="password-input-container">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={data.password} onChange={handleChange} disabled={loading} />
              <button className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-input-container">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={data.confirmPassword} onChange={handleChange} disabled={loading} />
              <button className="toggle-password-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="otp-preference-box">
              <p>Where do you want to receive the OTP?</p>
              <label>
                <input type="radio" name="otpPreference" value="email" checked={data.otpPreference === "email"} onChange={handleChange} />
                Email
              </label>
              <label>
                <input type="radio" name="otpPreference" value="mobile" checked={data.otpPreference === "mobile"} onChange={handleChange} />
                Mobile SMS
              </label>
            </div>

            <button onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="toggle-auth-mode">
              Already have an account? <span className="auth-link" onClick={switchMode}>Login here</span>
            </p>
          </>
        ) : (
          <>
            <input name="username" type="text" placeholder="UserName" value={data.username} onChange={handleChange} disabled={loading} />
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                disabled={loading}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              />
              <button className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="toggle-auth-mode">
              Don't have an account? <span className="auth-link" onClick={switchMode}>Register here</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
