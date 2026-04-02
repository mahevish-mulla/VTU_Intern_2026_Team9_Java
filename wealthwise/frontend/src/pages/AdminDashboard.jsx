import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-body, Epilogue, sans-serif)", color: "var(--text-white, #fff)" }}>
      <h1>admin dashboard</h1>
      <button 
        className="btn btn--outline" 
        style={{ marginTop: "20px" }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
