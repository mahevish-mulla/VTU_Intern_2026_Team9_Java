import { useState } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({ email: "", password: "" });

  function validate() {
    const e = { email: "", password: "" };
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return !e.email && !e.password;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    setError("");

    if (!validate()) return;
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth">
      <div className="auth__brand">
        <div className="auth__logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polyline
              points="2,16 7,10 11,13 16,6 20,8"
              stroke="#00e676"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="16,6 20,6 20,10"
              stroke="#00e676"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="auth__logo-text">
            Wealth<em>Wise</em>
          </span>
        </div>

        <div className="auth__brand-body">
          <h2 className="auth__brand-headline">
            All your Investments in
            <br />
            One <em>Organized</em>
            <br />
            dashboard
          </h2>
          <p className="auth__brand-sub">
            Track your mutual funds across Groww, Zerodha, Kite and more — with
            live NAV data and XIRR calculated automatically.
          </p>
        </div>

        <div className="auth__brand-stats">
          <div>
            <span className="auth__stat-num">mfAPI</span>
            <span className="auth__stat-lbl">Powered By</span>
          </div>
          <div>
            <span className="auth__stat-num">Daily</span>
            <span className="auth__stat-lbl">NAV Updates</span>
          </div>
          <div>
            <span className="auth__stat-num">Free</span>
            <span className="auth__stat-lbl">To Use</span>
          </div>
        </div>
      </div>

      <div className="auth__form-panel">
        <div className="auth__box">
          <h1 className="auth__box-title">Welcome back</h1>
          <p className="auth__box-sub">Sign in to your WealthWise account</p>

          {error && (
            <div className="auth__alert">
              <span className="auth__alert-ico">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth__grp">
              <label className="auth__lbl" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className={`auth__inp${errors.email ? " auth__inp--err" : ""}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((x) => ({ ...x, email: "" }));
                }}
                autoComplete="email"
              />
              {errors.email && (
                <span className="auth__err-msg">{errors.email}</span>
              )}
            </div>

            <div className="auth__grp">
              <label className="auth__lbl" htmlFor="login-pw">
                Password
              </label>
              <div className="auth__inp-wrap">
                <input
                  id="login-pw"
                  className={`auth__inp${errors.password ? " auth__inp--err" : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((x) => ({ ...x, password: "" }));
                  }}
                  autoComplete="current-password"
                  style={{ paddingRight: 56 }}
                />
                <button
                  type="button"
                  className="auth__pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && (
                <span className="auth__err-msg">{errors.password}</span>
              )}
            </div>
            <p style={{ textAlign: "right", marginTop: 6 }}>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#00e676",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </p>

            <button className="auth__btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="auth__switch">
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")}>Create one</button>
          </p>
        </div>
      </div>
    </div>
  );
}
