import { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [adminKey, setAdminKey] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/admin/login",
        { adminKey }
      );

      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="left">
        <h1>
          Centralized Dashboard <br />
          for <span>Admin</span> Management
        </h1>
        <p>
          Manage AMCs, mutual funds, and platform operations efficiently.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <div className="form-box">
          <h2>Admin Login</h2>

          <input
            type="text"
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />

          <button onClick={handleLogin}>Login →</button>
        </div>
      </div>
    </div>
  );
}