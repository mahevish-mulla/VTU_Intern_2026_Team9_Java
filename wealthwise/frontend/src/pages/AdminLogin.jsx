import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function AdminLogin() {
  const [adminKey, setAdminKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });

      const text = await res.text();
      let data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(
          (data && (data.message || data.error)) || "Admin login failed"
        );
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole", data.role);

      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth">
      {/* Brand panel — fills the empty left side */}
      <div className="auth__brand">
        <a className="auth__logo" href="/">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polyline points="2,16 7,10 11,13 16,6 20,8" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16,6 20,6 20,10" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="auth__logo-text">Wealth<em>Wise</em></span>
        </a>

        <div className="auth__brand-body">
          <h2 className="auth__brand-headline">
            Admin<br /><em>Control Centre</em>
          </h2>
          <p className="auth__brand-sub">
            Manage platform operations, monitor investments,
            track user growth, and oversee fund performance
            from a single dashboard.
          </p>
        </div>

        <div className="auth__brand-stats">
          <div>
            <span className="auth__stat-num">Real-time</span>
            <span className="auth__stat-lbl">Analytics</span>
          </div>
          <div>
            <span className="auth__stat-num">Full</span>
            <span className="auth__stat-lbl">Fund Control</span>
          </div>
          <div>
            <span className="auth__stat-num">Secure</span>
            <span className="auth__stat-lbl">Key-based Auth</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth__form-panel">
        <div className="auth__box">
          <h1 className="auth__box-title">Admin Access</h1>
          <p className="auth__box-sub">Enter your admin key to access the management dashboard</p>

          {error && (
            <div className="auth__alert">
              <span className="auth__alert-ico">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth__grp">
              <label className="auth__lbl">Admin Key</label>
              <div className="auth__inp-wrap">
                <input
                  className="auth__inp"
                  type={showKey ? "text" : "password"}
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                />
                <button
                  type="button"
                  className="auth__pw-toggle"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? "HIDE" : "SHOW"}
                </button>
              </div>
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