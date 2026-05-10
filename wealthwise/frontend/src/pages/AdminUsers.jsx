import { useState, useEffect } from "react";
import { ADMIN_API } from "../services/api";

// ─── User Detail Modal ────────────────────────────────────────────────────────
function UserDetailModal({ user, onClose }) {
  const [investments, setInvestments] = useState([]);
  const [loadingInv, setLoadingInv] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingInv(true);
    ADMIN_API.get(`/api/investments/${user.userId}`)
      .then((res) => setInvestments(res.data))
      .catch(() => setInvestments([]))
      .finally(() => setLoadingInv(false));
  }, [user]);

  if (!user) return null;

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })
    : "—";

  const isActive = user.status === "ACTIVE";

  const sips = investments.filter((i) => i.type?.toUpperCase() === "SIP");
  const lumpsums = investments.filter((i) => i.type?.toUpperCase() === "LUMP_SUM" || i.type?.toUpperCase() === "LUMPSUM");

  // Total invested = sum of SIP totalInvested + lumpsum amounts
  const totalInvested = investments.reduce((acc, inv) => {
    const type = inv.type?.toUpperCase();
    if (type === "SIP") return acc + (inv.totalInvested || inv.amount || 0);
    return acc + (inv.amount || 0);
  }, 0);

  const fmtINR = (n) => {
    if (!n && n !== 0) return "—";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          overflow: "hidden",
          animation: "adminModalSlideUp 0.22s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: "#111",
            borderBottom: "1px solid #2a2a2a",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f5a623, #f5784a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 800,
              color: "#000",
              flexShrink: 0,
              letterSpacing: "-0.5px",
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#e8e8e8" }}>
              {user.name}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              ID #{user.userId} &nbsp;·&nbsp;
              <span style={{ color: isActive ? "#00e676" : "#ff5252" }}>
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              background: "#1e1e1e",
              border: "1px solid #2e2e2e",
              color: "#888",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "20px 24px 24px" }}>

          {/* Contact Info */}
          <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            Account Info
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            {[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone || "Not provided" },
              { label: "Role", value: user.role },
              { label: "Joined", value: joined },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #222",
                  borderRadius: "10px",
                  padding: "12px 14px",
                }}
              >
                <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  {label}
                </div>
                <div style={{ fontSize: "13px", color: "#ccc", fontWeight: 500, wordBreak: "break-all" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Investment Stats */}
          <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            Investment Overview
          </div>

          {loadingInv ? (
            <div style={{ color: "#555", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
              Loading investments…
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                {
                  label: "Total Invested",
                  value: fmtINR(totalInvested),
                  accent: "#f5a623",
                },
                {
                  label: "Active Investments",
                  value: investments.length,
                  accent: "#5b8af5",
                },
                {
                  label: "SIP Count",
                  value: sips.length,
                  accent: "#34d399",
                },
                {
                  label: "Lumpsum Count",
                  value: lumpsums.length,
                  accent: "#a78bfa",
                },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  style={{
                    background: "#1a1a1a",
                    border: `1px solid #222`,
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: "10px",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: accent }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes adminModalSlideUp {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminUsers({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const endpoint = query
        ? `/api/admin/users/search?q=${encodeURIComponent(query)}`
        : "/api/admin/users";
      const res = await ADMIN_API.get(endpoint);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = newStatus === "ACTIVE" ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) return;

    try {
      await ADMIN_API.put(`/api/admin/users/${userId}/status`, { status: newStatus });
      showToast(`User status updated to ${newStatus}`);
      fetchUsers(searchQuery);
    } catch (err) {
      console.error(err);
      showToast("Failed to update user status");
    }
  };

  return (
    <>
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      <div className="page" style={{ padding: "32px", width: "100%", maxWidth: "1200px" }}>
        <div className="page__head" style={{ marginBottom: "24px" }}>
          <h1 className="page__title">User Management</h1>
          <p className="page__sub">View all investors and manage their accounts</p>
        </div>

        <div className="admin__card">
          <div className="admin__card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              All Registered Users
              <span className="admin__count">{users.length} Users</span>
            </div>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className="admin__input"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px", padding: "6px 12px", margin: 0 }}
              />
              <button type="submit" className="admin__btn" style={{ padding: "6px 12px" }}>Search</button>
              {searchQuery && (
                <button
                  type="button"
                  className="admin__btn"
                  style={{ padding: "6px 12px", background: "#2a2a2a", color: "#ccc", border: "1px solid #333" }}
                  onClick={() => { setSearchQuery(""); fetchUsers(""); }}
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {loading ? (
            <div style={{ color: "#555", padding: "20px 0", fontSize: "13px" }}>Loading users…</div>
          ) : users.length === 0 ? (
            <div className="admin__empty">No users found</div>
          ) : (
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Joined Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.userId}>
                      <td className="admin__td-num">{i + 1}</td>
                      <td className="admin__td-name" style={{ fontWeight: 500 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "Not Provided"}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u.status === "INACTIVE" ? (
                          <span className="admin__badge" style={{ background: "#ff525218", color: "#ff5252", border: "1px solid #ff525230" }}>Inactive</span>
                        ) : (
                          <span className="admin__badge" style={{ background: "#00e67618", color: "#00e676", border: "1px solid #00e67630" }}>Active</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            className="admin__btn"
                            style={{ padding: "4px 14px", background: "#1e1e1e", color: "#f5a623", border: "1px solid #f5a62330", fontSize: "12px" }}
                            onClick={() => setSelectedUser(u)}
                          >
                            View
                          </button>
                          <button
                            className="admin__btn"
                            style={{
                              padding: "4px 14px",
                              fontSize: "12px",
                              background: u.status === "ACTIVE" ? "#ff525218" : "#00e67618",
                              color: u.status === "ACTIVE" ? "#ff5252" : "#00e676",
                              border: `1px solid ${u.status === "ACTIVE" ? "#ff525230" : "#00e67630"}`,
                            }}
                            onClick={() => handleToggleStatus(u.userId, u.status)}
                          >
                            {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
