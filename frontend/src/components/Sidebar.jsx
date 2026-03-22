import { Ico } from "../utils/icons";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate();
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: <Ico.Dash /> },
    { id: "browse", label: "Browse Funds", icon: <Ico.Funds /> },
    { id: "investments", label: "My Investments", icon: <Ico.Invest /> },
    { id: "goals", label: "Goals", icon: <Ico.Goals /> },
    { id: "profile", label: "Profile", icon: <Ico.Profile /> },
  ];

  return (
    <div className="sidebar">
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
        <span className="sidebar__logo-text">
          Wealth<em>Wise</em>
        </span>
      </div>

      <nav className="sidebar__nav">
        {nav.map((n) => (
          <button
            key={n.id}
            className={`sidebar__item${active === n.id ? " sidebar__item--active" : ""}`}
            onClick={() => setActive(n.id)}
          >
            <span className="sidebar__item-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <div className="sidebar__divider" />
        <button 
          className="sidebar__logout"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          <span className="sidebar__item-icon">
            <Ico.Logout />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
}
