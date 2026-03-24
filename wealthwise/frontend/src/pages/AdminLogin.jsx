import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminKey }),
      });

      const text = await res.text();
      let data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(
          (data && (data.message || data.error)) || "Admin login failed",
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth">
      <div className="auth__form-panel">
        <div className="auth__box">
          <h1 className="auth__box-title">Admin Access</h1>
          <p className="auth__box-sub">Enter admin key to continue</p>

          {error && (
            <div className="auth__alert">
              <span className="auth__alert-ico">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth__grp">
              <label className="auth__lbl">Admin Key</label>
              <input
                className="auth__inp"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
              />
            </div>

            <button className="auth__btn" disabled={loading}>
              {loading ? "Authenticating…" : "Login as Admin →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
