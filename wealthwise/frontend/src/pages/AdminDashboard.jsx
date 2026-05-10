import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_API } from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import AdminUsers from "./AdminUsers";
import AdminAlerts from "./AdminAlerts";
import Toast from "../components/Toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';
import "../styles/admin.css";
import "../styles/InvestorPortal.css";

const COLORS = ['#5b8dee', '#a78bfa', '#34d399'];

/** Active shape for donut hover */
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 3} outerRadius={outerRadius + 5}
        startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.95} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#eef1f8" fontFamily="'JetBrains Mono'" fontSize="16" fontWeight="600">
        {value}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#667799" fontFamily="Epilogue" fontSize="11">
        {payload.name}
      </text>
    </g>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [schemeCode, setSchemeCode] = useState("");
  const [risk, setRisk] = useState("HIGH");
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [aumStats, setAumStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [addMessage, setAddMessage] = useState("");
  const [isAddError, setIsAddError] = useState(false);
  const [donutIdx, setDonutIdx] = useState(0);

  useEffect(() => {
    fetchFunds();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [usersRes, aumRes, allUsersRes] = await Promise.all([
        ADMIN_API.get("/api/admin/users/analytics"),
        ADMIN_API.get("/api/admin/analytics/aum"),
        ADMIN_API.get("/api/admin/users")
      ]);
      setUserStats(usersRes.data);
      setAumStats(aumRes.data);
      setAllUsers(allUsersRes.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const fetchFunds = () => {
    ADMIN_API.get("/api/funds/browse")
      .then(res => setFunds(res.data))
      .catch(err => console.error(err));
  };

  const handleDeleteFund = async (fundId) => {
    if (!window.confirm("Are you sure you want to deactivate/delete this fund?")) return;
    try {
      await ADMIN_API.put(`/api/admin/funds/${fundId}/deactivate`);
      setToast("Fund deactivated successfully");
      fetchFunds();
    } catch (err) {
      setToast(err.response?.data?.error || "Failed to deactivate fund");
    }
  };

  const handleAddFund = async () => {
    if (!schemeCode.trim()) {
      setIsAddError(true);
      setAddMessage("Please enter a scheme code");
      return;
    }
    setLoading(true);
    setAddMessage("");
    setIsAddError(false);
    try {
      await ADMIN_API.post(`/api/admin/funds/auto/${schemeCode}?risk=${risk}`);
      setSchemeCode("");
      setIsAddError(false);
      setAddMessage("✓ Fund added successfully");
      fetchFunds();
    } catch (err) {
      setIsAddError(true);
      setAddMessage(err.response?.data?.error || "Failed to add fund");
    } finally {
      setLoading(false);
    }
  };

  const riskBadgeColor = (r) => {
    if (r === "LOW") return "#00e676";
    if (r === "MEDIUM") return "#f5a623";
    if (r === "HIGH") return "#ff5252";
    return "#aaa";
  };

  const categoryBadgeColor = (cat) => {
    if (cat === "EQUITY") return "#5b8af5";
    if (cat === "DEBT") return "#a78bfa";
    if (cat === "HYBRID") return "#34d399";
    return "#aaa";
  };

  const getCategoryData = () => {
    const counts = { EQUITY: 0, DEBT: 0, HYBRID: 0 };
    funds.forEach(f => {
      if (f.active !== false) {
        counts[f.category] = (counts[f.category] || 0) + 1;
      }
    });
    return [
      { name: 'Equity', value: counts.EQUITY },
      { name: 'Debt', value: counts.DEBT },
      { name: 'Hybrid', value: counts.HYBRID }
    ].filter(d => d.value > 0);
  };

  const getGrowthData = () => {
    if (!allUsers || allUsers.length === 0) return [];
    const validUsers = allUsers.filter(u => u.createdAt || u.joinedDate);
    const sortedUsers = validUsers.sort((a, b) => new Date(a.createdAt || a.joinedDate) - new Date(b.createdAt || b.joinedDate));
    const data = [];
    let cumulative = 0;
    const uniqueMonths = [...new Set(sortedUsers.map(u => {
      const d = new Date(u.createdAt || u.joinedDate);
      return d.toLocaleString('default', { month: 'short', year: '2-digit' });
    }))];
    uniqueMonths.forEach(month => {
      const count = sortedUsers.filter(u => {
        const d = new Date(u.createdAt || u.joinedDate);
        return d.toLocaleString('default', { month: 'short', year: '2-digit' }) === month;
      }).length;
      cumulative += count;
      data.push({ name: month, Investors: cumulative });
    });
    if (data.length === 1) {
      data.unshift({ name: "Start", Investors: 0 });
    }
    return data;
  };

  const fmtAUM = (val) => {
    if (!val) return "...";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  const stats = [
    {
      label: "Total Investors",
      value: userStats ? userStats.totalInvestors : "—",
      sub: userStats ? `${userStats.activeInvestors} Active · ${userStats.inactiveInvestors} Inactive` : "Loading...",
      icon: "👥",
      color: "#5b8dee"
    },
    {
      label: "Assets Under Mgt.",
      value: aumStats ? fmtAUM(aumStats.totalAUM) : "—",
      sub: "Real-time valuation",
      icon: "📊",
      color: "#34d399"
    },
    {
      label: "Active Investments",
      value: aumStats ? aumStats.activeInvestmentCount : "—",
      sub: "Running SIPs + Lumpsums",
      icon: "📈",
      color: "#f5a623"
    },
    {
      label: "Listed Funds",
      value: funds.filter(f => f.active !== false).length,
      sub: `${funds.length} total incl. deactivated`,
      icon: "💼",
      color: "#a78bfa"
    }
  ];

  /* ────────────────────────── DASHBOARD TAB ────────────────────────── */
  const renderDashboard = () => (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Admin <em>Dashboard</em></h1>
        <p className="page__sub">Platform health and key metrics overview</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card__hd">
              <span className="stat-card__lbl">{s.label}</span>
              <span className="stat-card__ico">{s.icon}</span>
            </div>
            <div className="stat-card__val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card__meta">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="dash-grid">
        {/* Growth Chart */}
        <div className="card">
          <div className="card__label">Investor Growth</div>
          {getGrowthData().length === 0 ? (
            <div className="empty">
              <div className="empty__ico">📈</div>
              <p className="empty__sub">No user data available</p>
            </div>
          ) : (
            <div style={{ width: "100%", height: "240px", marginTop: "12px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getGrowthData()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5b8dee" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#5b8dee" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fill: '#667799', fontSize: 11, fontFamily: 'Epilogue' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: '#667799', fontSize: 11, fontFamily: 'Epilogue' }} width={40} />
                  <RechartsTooltip
                    contentStyle={{ background: "#0e1420", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }}
                    itemStyle={{ color: "#eef1f8" }}
                    labelStyle={{ color: "#667799" }}
                  />
                  <Area type="monotone" dataKey="Investors" stroke="#5b8dee" strokeWidth={2.5}
                    fillOpacity={1} fill="url(#adminGrowthGrad)" dot={false}
                    activeDot={{ r: 5, fill: "#5b8dee", stroke: "#0e1420", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Donut Chart */}
        <div className="card">
          <div className="card__label">Fund Categories</div>
          {getCategoryData().length === 0 ? (
            <div className="empty">
              <div className="empty__ico">◎</div>
              <p className="empty__sub">No active funds</p>
            </div>
          ) : (
            <div className="alloc-stack">
              <div className="alloc-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={donutIdx}
                      activeShape={renderActiveShape}
                      data={getCategoryData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      onMouseEnter={(_, index) => setDonutIdx(index)}
                      stroke="none"
                    >
                      {getCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="alloc-legend-grid">
                {getCategoryData().map((item, i) => (
                  <div className="alloc-legend-row" key={i} onMouseEnter={() => setDonutIdx(i)}>
                    <span className="alloc-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="alloc-legend-name">{item.name}</span>
                    <span className="alloc-legend-pct">{item.value} funds</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ────────────────────────── ADD FUNDS TAB ────────────────────────── */
  const renderAddFunds = () => (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Manage <em>Mutual Funds</em></h1>
        <p className="page__sub">Fetch and add new mutual funds or manage existing ones</p>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card__label">Add New Mutual Fund</div>
        <p style={{ fontSize: "12.5px", color: "var(--text-dim)", marginBottom: "20px", marginTop: "8px" }}>
          Enter a scheme code from{" "}
          <a href="https://api.mfapi.in/mf/search?q=sbi" target="_blank" rel="noreferrer"
            style={{ color: "var(--green)" }}>
            mfapi.in
          </a>{" "}
          — fund details are fetched automatically.
        </p>

        <div className="admin__form-row">
          <input
            className="admin__input"
            placeholder="Enter Scheme Code e.g. 120503"
            value={schemeCode}
            onChange={(e) => setSchemeCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddFund()}
          />
          <select className="admin__select" value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
          <button className="admin__btn" onClick={handleAddFund} disabled={loading}>
            {loading ? "Adding…" : "+ Add Fund"}
          </button>
        </div>

        {addMessage && (
          <div style={{
            marginTop: "16px", padding: "12px", borderRadius: "8px",
            background: isAddError ? "rgba(255,82,82,0.08)" : "rgba(0,230,118,0.08)",
            border: `1px solid ${isAddError ? "rgba(255,82,82,0.2)" : "rgba(0,230,118,0.2)"}`,
            color: isAddError ? "#ff5252" : "#00e676",
            fontSize: "13px"
          }}>
            {addMessage}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card__label-row">
          <div className="card__label">All Mutual Funds</div>
          <span style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px", padding: "3px 10px",
            fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-m)"
          }}>
            {funds.filter(f => f.active !== false).length} active
          </span>
        </div>

        {funds.length === 0 ? (
          <div className="empty">
            <div className="empty__ico">💼</div>
            <p className="empty__title">No funds added yet</p>
            <p className="empty__sub">Add your first mutual fund above</p>
          </div>
        ) : (
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Scheme Name</th>
                  <th>AMC</th>
                  <th>Category</th>
                  <th>Risk</th>
                  <th>NAV</th>
                  <th>Scheme Code</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {funds.filter((f) => f.active !== false).map((f, i) => (
                  <tr key={f.fundId}>
                    <td className="admin__td-num">{i + 1}</td>
                    <td className="admin__td-name">{f.fundName}</td>
                    <td>{f.amc?.amcName || "—"}</td>
                    <td>
                      <span className="admin__badge" style={{
                        background: categoryBadgeColor(f.category) + "22",
                        color: categoryBadgeColor(f.category),
                        border: `1px solid ${categoryBadgeColor(f.category)}44`,
                      }}>
                        {f.category}
                      </span>
                    </td>
                    <td>
                      <span className="admin__badge" style={{
                        background: riskBadgeColor(f.riskLevel) + "22",
                        color: riskBadgeColor(f.riskLevel),
                        border: `1px solid ${riskBadgeColor(f.riskLevel)}44`,
                      }}>
                        {f.riskLevel}
                      </span>
                    </td>
                    <td className="admin__td-nav">₹{Number(f.currentNav).toFixed(3)}</td>
                    <td className="admin__td-code">{f.schemeCode}</td>
                    <td>
                      <button className="admin__delete-btn" onClick={() => handleDeleteFund(f.fundId)}>
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  /* ────────────────────────── TABS MAP ────────────────────────── */
  const tabs = {
    dashboard: renderDashboard(),
    "add-funds": renderAddFunds(),
    users: <AdminUsers showToast={setToast} />,
    alerts: <AdminAlerts showToast={setToast} />
  };

  return (
    <div className={`portal${sidebarCollapsed ? " portal--collapsed" : ""}`}>
      <AdminSidebar
        active={activeTab}
        setActive={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      <div className="portal__main">
        <div className="portal__content">{tabs[activeTab]}</div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}