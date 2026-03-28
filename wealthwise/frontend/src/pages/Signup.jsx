import { useState, useMemo } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Too short", color: "#ff5252" },
    { label: "Weak", color: "#ff7043" },
    { label: "Fair", color: "#ffb300" },
    { label: "Good", color: "#69f0ae" },
    { label: "Strong", color: "#00e676" },
  ];
  return { score: s, ...map[s] };
}

export default function Signup() {
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalErr, setGlobalErr] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const strength = useMemo(() => getStrength(f.password), [f.password]);

  const set = (k) => (e) => {
    setF((x) => ({ ...x, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: "" }));
  };

  function validate() {
    const e = {};
    if (!f.firstName.trim()) e.firstName = "Required";
    if (!f.lastName.trim()) e.lastName = "Required";
    if (!f.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Enter a valid email";
    if (!f.password) e.password = "Password is required";
    else if (f.password.length < 8) e.password = "Min 8 characters";
    else if (strength.score < 2) e.password = "Password is too weak";
    if (!f.confirm) e.confirm = "Please confirm your password";
    else if (f.confirm !== f.password) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setGlobalErr("");
    if (!validate()) return;
    setLoading(true);
    try {
      const name = `${f.firstName} ${f.lastName}`;

	  const data = await registerUser(name, f.email, f.password, f.phone);

	  localStorage.setItem("token", data.token);
	  localStorage.setItem("role", data.role);

	  navigate("/dashboard");
    } catch (err) {
      setGlobalErr(err.message || "Signup failed");
    }

    setLoading(false);
  }

  if (success) {
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
              One <em>organized</em>
              <br />
              dashboard
            </h2>
            <p className="auth__brand-sub">
              Track your mutual funds across Groww, Zerodha, Kite and more —
              with live NAV data and XIRR calculated automatically.
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
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 18 }}>✓</div>
              <h2
                className="auth__box-title"
                style={{ textAlign: "center", marginBottom: 8 }}
              >
                You're in.
              </h2>
              <p
                className="auth__box-sub"
                style={{ textAlign: "center", marginBottom: 28 }}
              >
                Account created successfully, {f.firstName}.
              </p>
              <button className="auth__btn" onClick={() => navigate("/login")}>
                Go to Login →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
            All your SIPs.
            <br />
            One <em>clean</em>
            <br />
            dashboard.
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
          <h1 className="auth__box-title">Create account</h1>
          <p className="auth__box-sub">
            Start tracking your investments for free
          </p>

          {globalErr && (
            <div className="auth__alert">
              <span className="auth__alert-ico">✕</span>
              {globalErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth__row">
              <div className="auth__grp">
                <label className="auth__lbl" htmlFor="su-fn">
                  First Name
                </label>
                <input
                  id="su-fn"
                  className={`auth__inp${errors.firstName ? " auth__inp--err" : ""}`}
                  type="text"
                  placeholder="virat"
                  value={f.firstName}
                  onChange={set("firstName")}
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <span className="auth__err-msg">{errors.firstName}</span>
                )}
              </div>
              <div className="auth__grp">
                <label className="auth__lbl" htmlFor="su-ln">
                  Last Name
                </label>
                <input
                  id="su-ln"
                  className={`auth__inp${errors.lastName ? " auth__inp--err" : ""}`}
                  type="text"
                  placeholder="kohli"
                  value={f.lastName}
                  onChange={set("lastName")}
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <span className="auth__err-msg">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="auth__grp">
              <label className="auth__lbl" htmlFor="su-email">
                Email
              </label>
              <input
                id="su-email"
                className={`auth__inp${errors.email ? " auth__inp--err" : ""}`}
                type="email"
                placeholder="you@example.com"
                value={f.email}
                onChange={set("email")}
                autoComplete="email"
              />
              {errors.email && (
                <span className="auth__err-msg">{errors.email}</span>
              )}
            </div>
            <div className="auth__grp">
              <label className="auth__lbl">Phone number</label>
              <input
                id="su-phone"
                className={"auth__inp"}
                type="text"
                placeholder="1234567899"
                value={f.phone}
                onChange={set("phone")}
              />
            </div>

            <div className="auth__grp">
              <label className="auth__lbl" htmlFor="su-pw">
                Password
              </label>
              <div className="auth__inp-wrap">
                <input
                  id="su-pw"
                  className={`auth__inp${errors.password ? " auth__inp--err" : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={f.password}
                  onChange={set("password")}
                  autoComplete="new-password"
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
              {f.password && (
                <div className="auth__strength">
                  <div className="auth__strength-track">
                    <div
                      className="auth__strength-fill"
                      style={{
                        width: `${(strength.score / 4) * 100}%`,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <span
                    className="auth__strength-lbl"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="auth__err-msg">{errors.password}</span>
              )}
            </div>

            <div className="auth__grp">
              <label className="auth__lbl" htmlFor="su-confirm">
                Confirm Password
              </label>
              <input
                id="su-confirm"
                className={`auth__inp${errors.confirm ? " auth__inp--err" : ""}`}
                type="password"
                placeholder="Re-enter password"
                value={f.confirm}
                onChange={set("confirm")}
                autoComplete="new-password"
              />
              {errors.confirm && (
                <span className="auth__err-msg">{errors.confirm}</span>
              )}
            </div>

            <button className="auth__btn" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="auth__terms">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="auth__switch">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
