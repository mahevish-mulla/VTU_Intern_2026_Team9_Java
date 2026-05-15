// 
import { useState, useEffect } from "react";
import {
  getUserProfile,
  updatePassword,
  deleteAccount,
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "...", email: "..." });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUserProfile(token)
        .then((data) => setUser({ name: data.name, email: data.email, phone: data.phone }))
        .catch((e) => console.error("Failed to load profile", e));
    }
  }, [token]);

  const handleUpdate = async () => {
    setMsg(""); setErr("");
    if (!passwords.current || !passwords.newPass || !passwords.confirm) { setErr("All fields are required"); return; }
    if (passwords.newPass !== passwords.confirm) { setErr("New passwords do not match"); return; }
    if (passwords.newPass.length < 8) { setErr("New password must be at least 8 characters"); return; }
    try {
      await updatePassword(token, passwords.current, passwords.newPass);
      setMsg("Password updated successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (e) { setErr(e.message); }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(token);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (e) {
      setErr(e.message);
      setShowDeleteModal(false);
    }
  };

  const handleSubmitClosure = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setSubmitted(false);
      setCloseReason("");
      setMsg("Closure request submitted. Our team will contact you within 7 days.");
    }, 1800);
  };

  const details = [
    { lbl: "Full Name", val: user.name },
    { lbl: "Email", val: user.email },
    { lbl: "Phone Number", val: user.phone },
  ];

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Account <em>Settings</em></h1>
        <p className="page__sub">Manage your profile, credentials, and security preferences</p>
      </div>

      <div className="profile-layout">

        {/* ── Personal Details Card ── */}
        <div className="card">
          <div className="profile-avatar-row">
            <div className="profile-avatar">
              {user.name !== "..." ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
            </div>
          </div>

          <div className="section-sep">Personal Details</div>
          <div className="detail-grid">
            {details.map((d, i) => (
              <div className="detail-field" key={i}>
                <div className="detail-field__lbl">{d.lbl}</div>
                <div className="detail-field__val">{d.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Change Password Card ── */}
        <div className="card">
          <div className="section-sep">Change Password</div>

          {msg && <div className="profile-msg profile-msg--success">{msg}</div>}
          {err && <div className="profile-msg profile-msg--error">{err}</div>}

          <div className="form-grp">
            <label className="form-lbl">Current Password</label>
            <input className="form-inp" type="password" placeholder="Enter current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
          </div>
          <div className="form-grp">
            <label className="form-lbl">New Password</label>
            <input className="form-inp" type="password" placeholder="Min 8 characters"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Confirm New Password</label>
            <input className="form-inp" type="password" placeholder="Re-enter new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          </div>
          <button className="btn btn--primary" style={{ marginTop: 4 }} onClick={handleUpdate}>
            Update Password
          </button>
        </div>

        {/* ── Account Closure Card ── */}
        <div className="card profile-danger-card">
          <div className="section-sep profile-danger-sep">Account Closure</div>
          <p className="profile-danger-desc">
            For security and auditing purposes, financial accounts cannot be deleted instantly.
            Submit a formal closure request for our team to review.
          </p>
          <button className="btn profile-danger-btn" onClick={() => setShowDeleteModal(true)}>
            Request Account Closure
          </button>
        </div>

      </div>

      {/* ════ Account Closure Modal ════ */}
      {showDeleteModal && (
        <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}>
          <div className="modal" style={{ maxWidth: "480px" }}>
            <div className="modal__hd">
              <span className="modal__title" style={{ fontFamily: "'Fraunces', serif" }}>Close Account</span>
              <button className="modal__close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            
            <p className="modal__sub">
              {user.name} · {user.email}
            </p>
            
            <div className="form-grp">
              <label className="form-lbl">REASON FOR CLOSURE</label>
              <textarea 
                className="form-inp" 
                rows="3" 
                placeholder="e.g. Moving to another platform, no longer investing..."
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                style={{ resize: "none" }}
              />
            </div>

            <div style={{ padding: "14px", background: "rgba(255, 82, 82, 0.04)", borderRadius: "8px", border: "1px solid rgba(255, 82, 82, 0.15)", marginBottom: "24px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "rgba(255, 82, 82, 0.9)", lineHeight: "1.5" }}>
                <strong>Compliance Note:</strong> Financial records are retained for auditing purposes. 
                Your request will be processed after a 7-day security verification period.
              </p>
            </div>

            <div className="modal__footer">
              <button className="btn btn--ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button 
                className={`btn btn--primary btn--full${submitted ? " btn--loading" : ""}`}
                style={{ background: "#f5a623", borderColor: "#f5a623", color: "#000" }}
                onClick={handleSubmitClosure}
                disabled={submitted}
              >
                {submitted ? "Submitting…" : "Submit Request →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
