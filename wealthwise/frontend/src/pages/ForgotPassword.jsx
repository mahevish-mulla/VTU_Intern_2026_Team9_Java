import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/passwordReset.css";

const API = "http://localhost:8080/api/auth";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function sendOtp() {
    setError("");
    setMsg("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message);

      setMsg(data.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  }

  async function verifyOtp() {
    setError("");
    setMsg("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message);

      setMsg(data.message);
      setStep(3);
    } catch (err) {
      setError(err.message);
    }
  }

  async function resetPassword() {
    setError("");
    setMsg("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message);

      setMsg(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-reset">
      <h2>Forgot Password</h2>

      <p className="reset-step">
        {step === 1 && "STEP 1: ENTER EMAIL"}
        {step === 2 && "STEP 2: VERIFY OTP"}
        {step === 3 && "STEP 3: RESET PASSWORD"}
      </p>

      {error && <p className="reset-error">{error}</p>}
      {msg && <p className="reset-msg">{msg}</p>}

      {step === 1 && (
        <div className="reset-group">
          <input
            className="reset-input"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="reset-btn" onClick={sendOtp}>
            Send OTP
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="reset-group">
          <input
            className="reset-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="reset-btn" onClick={verifyOtp}>
            Verify OTP
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="reset-group">
          <input
            className="reset-input"
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="reset-btn" onClick={resetPassword}>
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
