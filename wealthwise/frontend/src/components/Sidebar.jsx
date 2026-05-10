import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ico } from "../utils/icons";

export default function Sidebar({ active, setActive, collapsed, onToggle }) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: <Ico.Dash /> },
    { id: "browse", label: "Browse Funds", icon: <Ico.Funds /> },
    { id: "investments", label: "Transactions", icon: <Ico.Invest /> },
    { id: "estimator", label: "Estimator", icon: <Ico.Calc /> },
    { id: "goals", label: "Goals", icon: <Ico.Goals /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
      {/* ── Logo + collapse toggle ──────────────────────────── */}
      <div className="sidebar__logo">
        <span className="sidebar__logo-mark">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polyline
              points="2,16 7,10 11,13 16,6 20,8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--green)" }}
            />
            <polyline
              points="16,6 20,6 20,10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--green)" }}
            />
          </svg>
        </span>
        {!collapsed && (
          <span className="sidebar__logo-text">
            Wealth<em>Wise</em>
          </span>
        )}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {collapsed ? (
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="sidebar__nav">
        {nav.map((n) => (
          <button
            key={n.id}
            className={`sidebar__item${active === n.id ? " sidebar__item--active" : ""}`}
            onClick={() => setActive(n.id)}
            title={collapsed ? n.label : undefined}
          >
            <span className="sidebar__item-icon">{n.icon}</span>
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {/* ── Bottom: Logout ──────────────────────────────────── */}
      <div className="sidebar__bottom">
        <div className="sidebar__divider" />
        <button
          className="sidebar__logout"
          onClick={() => setShowLogoutConfirm(true)}
          title={collapsed ? "Logout" : undefined}
        >
          <span className="sidebar__item-icon">
            <Ico.Logout />
          </span>
          {!collapsed && "Logout"}
        </button>
      </div>

      {/* ── Logout confirmation modal ─────────────────────── */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal__icon">
              <Ico.Logout />
            </div>
            <h3 className="logout-modal__title">Confirm Logout</h3>
            <p className="logout-modal__msg">Are you sure you want to logout?</p>
            <div className="logout-modal__actions">
              <button
                className="logout-modal__btn logout-modal__btn--cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="logout-modal__btn logout-modal__btn--confirm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
