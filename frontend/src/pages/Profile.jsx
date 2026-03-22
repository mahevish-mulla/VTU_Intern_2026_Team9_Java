import { useState, useEffect } from "react";
import { getUserProfile, updatePassword, deleteAccount } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "...", email: "..." });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUserProfile(token)
        .then((data) => setUser({ name: data.name, email: data.email }))
        .catch((e) => console.error("Failed to load profile", e));
    }
  }, [token]);

  const handleUpdate = async () => {
    setMsg("");
    setErr("");
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setErr("All fields are required");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setErr("New passwords do not match");
      return;
    }
    if (passwords.newPass.length < 8) {
      setErr("New password must be at least 8 characters");
      return;
    }

    try {
      await updatePassword(token, passwords.current, passwords.newPass);
      setMsg("Password updated successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (e) {
      setErr(e.message);
    }
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

  const details = [
    { lbl: "Full Name", val: user.name },
    { lbl: "Email", val: user.email },
    { lbl: "Phone", val: "+91 98765 43210" },
  ];

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Profile</h1>
        <p className="page__sub">Your account details</p>
      </div>

      <div className="profile-layout">
        <div className="card">
          <div className="profile-avatar-row">
            <div className="profile-avatar">{user.name !== "..." ? user.name.charAt(0).toUpperCase() : "?"}</div>
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
              <div className="kyc-tag">✓ KYC Verified</div>
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

        <div className="card">
          <div className="section-sep">Change Password</div>
          
          {msg && <div style={{ color: "#00e676", marginBottom: "1rem" }}>{msg}</div>}
          {err && <div style={{ color: "#ff5252", marginBottom: "1rem" }}>{err}</div>}

          <div className="form-grp">
            <label className="form-lbl">Current Password</label>
            <input
              className="form-inp"
              type="password"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          <div className="form-grp">
            <label className="form-lbl">New Password</label>
            <input
              className="form-inp"
              type="password"
              placeholder="Min 8 characters"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
            />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Confirm New Password</label>
            <input
              className="form-inp"
              type="password"
              placeholder="Re-enter new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>
          <button 
            className="btn btn--primary" 
            style={{ marginTop: 4 }}
            onClick={handleUpdate}
          >
            Update Password
          </button>
        </div>

        <div className="card" style={{ marginTop: "2rem" }}>
          <div className="section-sep">Danger Zone</div>
          <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
            Permanently remove your account and all associated data.
          </p>
          <button 
            className="btn btn--primary" 
            style={{ backgroundColor: "#ff5252", borderColor: "#ff5252", marginTop: 4 }}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div 
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 9999
          }}
        >
          <div 
            style={{
              backgroundColor: "var(--bg-card, #1a1a1a)",
              color: "var(--text-main, #fff)",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "1.25rem" }}>Delete Account</h3>
            <p style={{ margin: "16px 0 24px", lineHeight: 1.5, color: "var(--text-light, #ccc)" }}>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button 
                className="btn" 
                style={{ backgroundColor: "transparent", color: "var(--text-main, #fff)", border: "1px solid #444" }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn--primary" 
                style={{ backgroundColor: "#ff5252", borderColor: "#ff5252" }}
                onClick={handleDeleteAccount}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
