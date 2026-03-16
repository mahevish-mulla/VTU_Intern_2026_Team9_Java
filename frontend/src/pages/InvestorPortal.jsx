import { useState, useMemo, useEffect } from "react";
import "../styles/InvestorPortal.css";
import { useNavigate } from "react-router-dom";

const Ico = {
  Dash: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="1"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="9"
        y="1"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="1"
        y="9"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
  Funds: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 4.5v7M6.5 6c0-.83.67-1.5 1.5-1.5h1a1.5 1.5 0 0 1 0 3H8a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 0 1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  Invest: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polyline
        points="1.5,11.5 5,7 8,9 11.5,4.5 14.5,6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="12,4 14.5,4 14.5,6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Goals: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
    </svg>
  ),
  Profile: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M10 11l3-3-3-3M13 8H6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line
        x1="7"
        y1="2"
        x2="7"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="7"
        x2="12"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <line
        x1="9.5"
        y1="9.5"
        x2="12.5"
        y2="12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M11.5 3.5l-.8 8a.5.5 0 0 1-.5.5H3.8a.5.5 0 0 1-.5-.5l-.8-8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const FUNDS = [
  {
    id: 1,
    name: "SBI Bluechip Fund",
    house: "SBI Mutual Fund",
    category: "Large Cap",
    nav: 82.1,
    risk: "LOW",
    ret1y: 9.2,
    ret3y: 14.2,
  },
  {
    id: 2,
    name: "HDFC Mid-Cap Opportunities",
    house: "HDFC Mutual Fund",
    category: "Mid Cap",
    nav: 130.5,
    risk: "MODERATE",
    ret1y: 16.7,
    ret3y: 22.1,
  },
  {
    id: 3,
    name: "ICICI Pru Technology Fund",
    house: "ICICI Prudential",
    category: "Sectoral",
    nav: 195.6,
    risk: "HIGH",
    ret1y: 24.5,
    ret3y: 31.2,
  },
  {
    id: 4,
    name: "Axis Long Term Equity (ELSS)",
    house: "Axis Mutual Fund",
    category: "ELSS",
    nav: 78.2,
    risk: "MODERATE",
    ret1y: 11.4,
    ret3y: 17.8,
  },
  {
    id: 5,
    name: "Kotak Small Cap Fund",
    house: "Kotak Mahindra MF",
    category: "Small Cap",
    nav: 198.3,
    risk: "HIGH",
    ret1y: 28.3,
    ret3y: 35.6,
  },
  {
    id: 6,
    name: "SBI Liquid Fund",
    house: "SBI Mutual Fund",
    category: "Liquid",
    nav: 3842.15,
    risk: "LOW",
    ret1y: 6.8,
    ret3y: 6.2,
  },
  {
    id: 7,
    name: "Mirae Asset Emerging Bluechip",
    house: "Mirae Asset MF",
    category: "Large & Mid Cap",
    nav: 110.4,
    risk: "MODERATE",
    ret1y: 14.2,
    ret3y: 19.8,
  },
  {
    id: 8,
    name: "Parag Parikh Flexi Cap",
    house: "PPFAS Mutual Fund",
    category: "Flexi Cap",
    nav: 68.9,
    risk: "MODERATE",
    ret1y: 12.8,
    ret3y: 18.4,
  },
  {
    id: 9,
    name: "DSP Midcap Fund",
    house: "DSP Mutual Fund",
    category: "Mid Cap",
    nav: 92.75,
    risk: "MODERATE",
    ret1y: 15.6,
    ret3y: 20.3,
  },
  {
    id: 10,
    name: "Nippon India Small Cap",
    house: "Nippon India MF",
    category: "Small Cap",
    nav: 145.6,
    risk: "HIGH",
    ret1y: 31.2,
    ret3y: 38.9,
  },
  {
    id: 11,
    name: "HDFC Top 100 Fund",
    house: "HDFC Mutual Fund",
    category: "Large Cap",
    nav: 912.45,
    risk: "LOW",
    ret1y: 8.4,
    ret3y: 13.1,
  },
  {
    id: 12,
    name: "Quant Active Fund",
    house: "Quant Mutual Fund",
    category: "Multi Cap",
    nav: 584.3,
    risk: "HIGH",
    ret1y: 42.1,
    ret3y: 48.6,
  },
];

const INITIAL_INVESTMENTS = [
  {
    id: 1,
    fundId: 1,
    type: "sip",
    monthlyAmount: 5000,
    instalments: 12,
    totalInvested: 60000,
    avgNAV: 75.2,
    units: 797.87,
    startDate: "2025-04-01",
    nextSIP: "2026-04-01",
  },
  {
    id: 2,
    fundId: 2,
    type: "lumpsum",
    amount: 50000,
    buyNAV: 115.3,
    units: 433.65,
    date: "2025-06-15",
  },
  {
    id: 3,
    fundId: 7,
    type: "sip",
    monthlyAmount: 3000,
    instalments: 9,
    totalInvested: 27000,
    avgNAV: 102.4,
    units: 263.67,
    startDate: "2025-07-01",
    nextSIP: "2026-04-05",
  },
];

const INITIAL_GOALS = [
  {
    id: 1,
    name: "Own a Home",
    category: "home",
    emoji: "🏠",
    targetAmount: 5000000,
    targetDate: "2035-01-01",
    currentSaved: 151206,
    description: "2BHK in Bangalore",
  },
  {
    id: 2,
    name: "Retirement Fund",
    category: "retirement",
    emoji: "🌴",
    targetAmount: 20000000,
    targetDate: "2050-01-01",
    currentSaved: 0,
    description: "Early retirement",
  },
];

const CHART_DATA = {
  "6M": [
    { m: "Oct", v: 103800 },
    { m: "Nov", v: 118600 },
    { m: "Dec", v: 122400 },
    { m: "Jan", v: 134900 },
    { m: "Feb", v: 143700 },
    { m: "Mar", v: 151206 },
  ],
  "1Y": [
    { m: "Apr", v: 5000 },
    { m: "May", v: 13500 },
    { m: "Jun", v: 69200 },
    { m: "Jul", v: 72100 },
    { m: "Aug", v: 85800 },
    { m: "Sep", v: 94300 },
    { m: "Oct", v: 103800 },
    { m: "Nov", v: 118600 },
    { m: "Dec", v: 122400 },
    { m: "Jan", v: 134900 },
    { m: "Feb", v: 143700 },
    { m: "Mar", v: 151206 },
  ],
};

const FUND_COLORS = [
  "#00e676",
  "#00c853",
  "#00897b",
  "#1b5e20",
  "#2e7d32",
  "#4caf50",
  "#81c784",
  "#a5d6a7",
  "#69f0ae",
  "#b9f6ca",
  "#00bfa5",
  "#64ffda",
];

const GOAL_EMOJIS = {
  home: "🏠",
  retirement: "🌴",
  education: "📚",
  car: "🚗",
  travel: "✈️",
  emergency: "🛡️",
  other: "⭐",
};
const CATEGORIES = [
  "All",
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "ELSS",
  "Flexi Cap",
  "Sectoral",
  "Liquid",
  "Multi Cap",
  "Large & Mid Cap",
];

function fmtINR(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
function fmtFull(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
function abbr(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 4)
    .toUpperCase();
}
function getInvested(inv) {
  return inv.type === "sip" ? inv.totalInvested : inv.amount;
}
function getCurrentVal(inv, funds) {
  const f = funds.find((f) => f.id === inv.fundId);
  return f ? parseFloat((inv.units * f.nav).toFixed(2)) : 0;
}

function PortfolioChart({ period, setPeriod }) {
  const data = CHART_DATA[period];
  const W = 500,
    H = 148;
  const max = Math.max(...data.map((d) => d.v));
  const pts = data.map((d, i) => [
    (i / (data.length - 1)) * W,
    H - 6 - (d.v / (max * 1.05)) * (H - 12),
  ]);
  const curve = pts
    .map(([x, y], i) => {
      if (i === 0) return `M ${x} ${y}`;
      const [px, py] = pts[i - 1];
      const cx = (px + x) / 2;
      return `C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
    })
    .join(" ");
  const area = `${curve} L ${W} ${H} L 0 ${H} Z`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <>
      <div className="chart-tabs">
        {["6M", "1Y"].map((p) => (
          <button
            key={p}
            className={`chart-tab${period === p ? " chart-tab--active" : ""}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        overflow="visible"
      >
        <defs>
          <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00e676" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
          </linearGradient>
          <filter id="cgl">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0.33, 0.66].map((t, i) => (
          <line
            key={i}
            x1={0}
            y1={H * t}
            x2={W}
            y2={H * t}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        <path d={area} fill="url(#cg)" />
        <path
          d={curve}
          fill="none"
          stroke="#00e676"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#cgl)"
          className="chart-line"
        />
        <circle cx={lx} cy={ly} r={7} fill="rgba(0,230,118,0.15)" />
        <circle cx={lx} cy={ly} r={3.5} fill="#00e676" filter="url(#cgl)" />
      </svg>
      <div className="chart-x">
        {data.map((d, i) => (
          <span className="chart-x-lbl" key={i}>
            {d.m}
          </span>
        ))}
      </div>
    </>
  );
}

function AllocationDonut({ investments, funds }) {
  if (!investments.length)
    return (
      <div className="empty">
        <div className="empty__ico">◎</div>
        <p className="empty__sub">No investments yet</p>
      </div>
    );
  const items = investments.map((inv, i) => {
    const f = funds.find((x) => x.id === inv.fundId);
    return {
      name: f?.name || "Unknown",
      val: getCurrentVal(inv, funds),
      color: FUND_COLORS[i % FUND_COLORS.length],
    };
  });
  const total = items.reduce((a, b) => a + b.val, 0);
  const slices = items.map((it) => ({
    ...it,
    pct: total ? (it.val / total) * 100 : 0,
  }));
  const r = 52,
    cx = 64,
    cy = 64,
    sw = 13,
    circ = 2 * Math.PI * r;
  const segs = slices.map((s, i) => {
    const dash = (s.pct / 100) * circ;

    const off = slices
      .slice(0, i)
      .reduce((sum, prev) => sum + (prev.pct / 100) * circ, 0);

    return { ...s, dash, off };
  });
  return (
    <div className="donut-block">
      <svg width="128" height="128" viewBox="0 0 128 128">
        {segs.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={sw}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={-s.off}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "64px 64px",
            }}
          />
        ))}
        <circle cx={cx} cy={cy} r={r - sw / 2 - 2} fill="var(--black-2)" />
      </svg>
      <div className="donut-legend">
        {slices.map((s, i) => (
          <div className="donut-legend-row" key={i}>
            <div className="donut-dot" style={{ background: s.color }} />
            <span className="donut-name">
              {s.name.split(" ").slice(0, 3).join(" ")}
            </span>
            <span className="donut-pct">{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddInvestmentModal({ fund, onClose, onAdd }) {
  const [tab, setTab] = useState("sip");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const units = amount
    ? parseFloat((parseFloat(amount) / fund.nav).toFixed(4))
    : 0;

  function submit() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    const nextSIP = (() => {
      const d = new Date(date);
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().split("T")[0];
    })();
    if (tab === "sip") {
      onAdd({
        id: Date.now(),
        fundId: fund.id,
        type: "sip",
        monthlyAmount: amt,
        instalments: 1,
        totalInvested: amt,
        avgNAV: fund.nav,
        units,
        startDate: date,
        nextSIP,
      });
    } else {
      onAdd({
        id: Date.now(),
        fundId: fund.id,
        type: "lumpsum",
        amount: amt,
        buyNAV: fund.nav,
        units,
        date,
      });
    }
    onClose();
  }

  return (
    <div
      className="modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal__hd">
          <span className="modal__title">Add Investment</span>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="modal__sub">
          {fund.name} · NAV {fmtFull(fund.nav)}
        </p>

        <div className="modal__tabs">
          {["sip", "lumpsum"].map((t) => (
            <button
              key={t}
              className={`modal__tab${tab === t ? " modal__tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "sip" ? "SIP" : "Lumpsum"}
            </button>
          ))}
        </div>

        <div className="form-grp">
          <label className="form-lbl">
            {tab === "sip" ? "Monthly Amount (₹)" : "Amount (₹)"}
          </label>
          <input
            className="form-inp"
            type="number"
            min="1"
            placeholder={`Min ₹${tab === "sip" ? 500 : 1000}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-grp">
          <label className="form-lbl">
            {tab === "sip" ? "SIP Start Date" : "Investment Date"}
          </label>
          <input
            className="form-inp"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {amount > 0 && (
          <div className="modal__preview">
            {tab === "sip"
              ? `First instalment: ${fmtFull(parseFloat(amount))} → ${units} units @ ₹${fund.nav}`
              : `${fmtFull(parseFloat(amount))} → ${units} units @ ₹${fund.nav}`}
          </div>
        )}

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary btn--full" onClick={submit}>
            Add to Portfolio →
          </button>
        </div>
      </div>
    </div>
  );
}

function AddGoalModal({ onClose, onAdd }) {
  const [f, setF] = useState({
    name: "",
    category: "home",
    targetAmount: "",
    targetDate: "",
    currentSaved: "",
    description: "",
  });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  function submit() {
    if (!f.name || !f.targetAmount || !f.targetDate) return;
    onAdd({
      id: Date.now(),
      name: f.name,
      category: f.category,
      emoji: GOAL_EMOJIS[f.category] || "⭐",
      targetAmount: parseFloat(f.targetAmount),
      targetDate: f.targetDate,
      currentSaved: parseFloat(f.currentSaved) || 0,
      description: f.description,
    });
    onClose();
  }

  return (
    <div
      className="modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal__hd">
          <span className="modal__title">New Goal</span>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-grp">
          <label className="form-lbl">Goal Name</label>
          <input
            className="form-inp"
            placeholder="e.g. Own a home in Bangalore"
            value={f.name}
            onChange={set("name")}
          />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Category</label>
          <select
            className="form-sel"
            value={f.category}
            onChange={set("category")}
          >
            <option value="home">🏠 Home</option>
            <option value="retirement">🌴 Retirement</option>
            <option value="education">📚 Education</option>
            <option value="car">🚗 Car</option>
            <option value="travel">✈️ Travel / Vacation</option>
            <option value="emergency">🛡️ Emergency Fund</option>
            <option value="other">⭐ Other</option>
          </select>
        </div>
        <div className="form-grp">
          <label className="form-lbl">Target Amount (₹)</label>
          <input
            className="form-inp"
            type="number"
            placeholder="e.g. 5000000"
            value={f.targetAmount}
            onChange={set("targetAmount")}
          />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Target Date</label>
          <input
            className="form-inp"
            type="date"
            value={f.targetDate}
            onChange={set("targetDate")}
          />
        </div>
        <div className="form-grp">
          <label className="form-lbl">Already Saved (₹) — Optional</label>
          <input
            className="form-inp"
            type="number"
            placeholder="0"
            value={f.currentSaved}
            onChange={set("currentSaved")}
          />
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary btn--full" onClick={submit}>
            Create Goal →
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ investments, funds }) {
  const [period, setPeriod] = useState("1Y");

  const totalInvested = investments.reduce((a, inv) => a + getInvested(inv), 0);
  const currentValue = investments.reduce(
    (a, inv) => a + getCurrentVal(inv, funds),
    0,
  );
  const totalReturn = currentValue - totalInvested;
  const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  const activeSIPs = investments.filter((i) => i.type === "sip");

  const stats = [
    {
      lbl: "Total Invested",
      val: fmtINR(totalInvested),
      meta: `${investments.length} fund${investments.length !== 1 ? "s" : ""}`,
      ico: "💼",
      cls: "",
    },
    {
      lbl: "Current Value",
      val: fmtINR(currentValue),
      meta: "Portfolio value",
      ico: "📈",
      cls: "",
    },
    {
      lbl: "Total Returns",
      val: (totalReturn >= 0 ? "+" : "") + fmtINR(Math.abs(totalReturn)),
      meta: `${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(2)}% overall`,
      ico: "◎",
      cls: totalReturn >= 0 ? "--g" : "--r",
    },
    {
      lbl: "Active SIPs",
      val: activeSIPs.length.toString(),
      meta: `${activeSIPs.length} running`,
      ico: "🔄",
      cls: "",
    },
  ];

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">My Dashboard</h1>
        <p className="page__sub">
          Welcome back — here's your investment summary
        </p>
      </div>

      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card__hd">
              <span className="stat-card__lbl">{s.lbl}</span>
              <span className="stat-card__ico">{s.ico}</span>
            </div>
            <div
              className={`stat-card__val${s.cls ? ` stat-card__val${s.cls}` : ""}`}
            >
              {s.val}
            </div>
            <div className="stat-card__meta">{s.meta}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card__label">Portfolio Growth</div>
          <PortfolioChart period={period} setPeriod={setPeriod} />
        </div>
        <div className="card">
          <div className="card__label">Fund Allocation</div>
          <AllocationDonut investments={investments} funds={funds} />
        </div>
      </div>

      <div className="dash-grid-b">
        <div className="card">
          <div className="card__label">Your Holdings</div>
          {investments.length === 0 ? (
            <div className="empty">
              <div className="empty__ico">◈</div>
              <p className="empty__title">No investments yet</p>
              <p className="empty__sub">
                Browse Funds to add your first investment
              </p>
            </div>
          ) : (
            <div className="holding-list">
              {investments.map((inv) => {
                const fund = funds.find((f) => f.id === inv.fundId);
                if (!fund) return null;
                const val = getCurrentVal(inv, funds);
                const invested = getInvested(inv);
                const ret = val - invested;
                const retPct = (ret / invested) * 100;
                return (
                  <div className="holding-row" key={inv.id}>
                    <div className="holding-ico">{abbr(fund.name)}</div>
                    <div className="holding-info">
                      <div className="holding-name">{fund.name}</div>
                      <div className="holding-meta">
                        {fund.category} ·{" "}
                        {inv.type === "sip"
                          ? `SIP ₹${inv.monthlyAmount.toLocaleString("en-IN")}/mo`
                          : "Lumpsum"}
                      </div>
                    </div>
                    <div className="holding-right">
                      <div className="holding-val">{fmtFull(val)}</div>
                      <span
                        className={`holding-ret holding-ret--${ret >= 0 ? "up" : "down"}`}
                      >
                        {ret >= 0 ? "+" : ""}
                        {retPct.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card__label">Upcoming SIPs</div>
          {activeSIPs.length === 0 ? (
            <div className="empty">
              <div className="empty__ico">🔄</div>
              <p className="empty__sub">No active SIPs</p>
            </div>
          ) : (
            <div className="sip-list">
              {activeSIPs.map((inv) => {
                const fund = funds.find((f) => f.id === inv.fundId);
                return (
                  <div className="sip-row" key={inv.id}>
                    <div>
                      <div className="sip-row__name">{fund?.name}</div>
                      <div className="sip-row__date">Due {inv.nextSIP}</div>
                    </div>
                    <div className="sip-row__amt">
                      {fmtFull(inv.monthlyAmount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BrowseFundsPage({ funds, investments, onAddInvestment, showToast }) {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [cat, setCat] = useState("All");
  const [modal, setModal] = useState(null);

  const ownedFundIds = new Set(investments.map((i) => i.fundId));

  const filtered = useMemo(() => {
    return funds.filter((f) => {
      const matchQ =
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.house.toLowerCase().includes(query.toLowerCase());
      const matchR =
        risk === "All" || f.risk.toUpperCase() === risk.toUpperCase();
      const matchC = cat === "All" || f.category === cat;
      return matchQ && matchR && matchC;
    });
  }, [funds, query, risk, cat]);

  function handleAdd(inv) {
    onAddInvestment(inv);
    showToast(`Added to your portfolio!`);
  }

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Browse Funds</h1>
        <p className="page__sub">
          Explore mutual funds and add them to your portfolio
        </p>
      </div>

      <div className="browse-bar">
        <div className="search-wrap">
          <span className="search-ico">
            <Ico.Search />
          </span>
          <input
            className="search-input"
            placeholder="Search by fund name or AMC..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="risk-filter"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          <option>All Risk</option>
          <option value="LOW">Low Risk</option>
          <option value="MODERATE">Moderate Risk</option>
          <option value="HIGH">High Risk</option>
        </select>
      </div>

      <div className="cat-strip">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-pill${cat === c ? " cat-pill--active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__ico">◈</div>
          <p className="empty__title">No funds found</p>
          <p className="empty__sub">Try a different search or filter</p>
        </div>
      ) : (
        <div className="fund-grid">
          {filtered.map((f) => (
            <div className="fund-card" key={f.id}>
              <div className="fund-card__top">
                <div>
                  <div className="fund-card__name">{f.name}</div>
                  <div className="fund-card__house">{f.house}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <span className={`badge badge--${f.risk.toLowerCase()}`}>
                    {f.risk}
                  </span>
                  {ownedFundIds.has(f.id) && (
                    <span className="fund-card__owned-badge">Invested</span>
                  )}
                </div>
              </div>

              <div className="fund-card__stats">
                <div>
                  <div className="fund-stat-lbl">Category</div>
                  <div className="fund-stat-val">{f.category}</div>
                </div>
                <div>
                  <div className="fund-stat-lbl">NAV</div>
                  <div className="fund-stat-val">
                    ₹{f.nav.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="fund-stat-lbl">1Y Return</div>
                  <div className="fund-stat-val fund-stat-val--g">
                    +{f.ret1y}%
                  </div>
                </div>
              </div>

              <div className="fund-card__btns">
                <button
                  className="btn btn--primary btn--sm btn--full"
                  onClick={() => setModal(f)}
                >
                  + Add SIP / Lumpsum
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <AddInvestmentModal
          fund={modal}
          onClose={() => setModal(null)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}

function MyInvestmentsPage({ investments, funds, onDelete }) {
  const [filter, setFilter] = useState("All");

  const totalInvested = investments.reduce((a, inv) => a + getInvested(inv), 0);
  const currentValue = investments.reduce(
    (a, inv) => a + getCurrentVal(inv, funds),
    0,
  );
  const totalReturn = currentValue - totalInvested;
  const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  const filtered =
    filter === "All"
      ? investments
      : investments.filter((i) => i.type === filter.toLowerCase());

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">My Investments</h1>
        <p className="page__sub">
          All your SIPs and lumpsum investments in one place
        </p>
      </div>

      <div className="inv-summary">
        {[
          { lbl: "Total Invested", val: fmtFull(totalInvested), cls: "" },
          {
            lbl: "Current Value",
            val: fmtFull(Math.round(currentValue)),
            cls: "",
          },
          {
            lbl: "Total Returns",
            val:
              (totalReturn >= 0 ? "+" : "") +
              fmtFull(Math.abs(totalReturn)) +
              " (" +
              ((totalReturn >= 0 ? "+" : "") + returnPct.toFixed(2)) +
              "%)",
            cls: totalReturn >= 0 ? "--g" : "--r",
          },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card__hd">
              <span className="stat-card__lbl">{s.lbl}</span>
            </div>
            <div
              className={`stat-card__val${s.cls ? " stat-card__val" + s.cls : ""}`}
            >
              {s.val}
            </div>
          </div>
        ))}
      </div>

      <div className="filter-row">
        {["All", "SIP", "Lumpsum"].map((f) => (
          <button
            key={f}
            className={`filter-pill${filter === f ? " filter-pill--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__ico">◈</div>
          <p className="empty__title">No investments found</p>
          <p className="empty__sub">Add investments from Browse Funds</p>
        </div>
      ) : (
        <div className="inv-list">
          {filtered.map((inv) => {
            const fund = funds.find((f) => f.id === inv.fundId);
            if (!fund) return null;
            const val = getCurrentVal(inv, funds);
            const invested = getInvested(inv);
            const ret = val - invested;
            const retPct = (ret / invested) * 100;

            return (
              <div className="inv-card" key={inv.id}>
                <div>
                  <div className="inv-card__name">{fund.name}</div>
                  <div className="inv-card__tags">
                    <span className={`inv-tag inv-tag--${inv.type}`}>
                      {inv.type === "sip" ? "SIP" : "Lumpsum"}
                    </span>
                    <span className="inv-tag inv-tag--cat">
                      {fund.category}
                    </span>
                    {inv.type === "sip" && (
                      <span
                        style={{
                          fontFamily: "var(--font-m)",
                          fontSize: 10,
                          color: "var(--text-dim)",
                        }}
                      >
                        ₹{inv.monthlyAmount.toLocaleString("en-IN")}/mo ·{" "}
                        {inv.instalments} instalments
                      </span>
                    )}
                  </div>
                </div>

                <div className="inv-col">
                  <div className="inv-col-lbl">Invested</div>
                  <div className="inv-col-val">{fmtFull(invested)}</div>
                  <div className="inv-col-sub">
                    {inv.units.toFixed(3)} units
                  </div>
                </div>

                <div className="inv-col">
                  <div className="inv-col-lbl">Current Value</div>
                  <div className="inv-col-val">{fmtFull(val)}</div>
                  <div className="inv-col-sub">
                    NAV ₹{fund.nav.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="inv-col">
                  <div className="inv-col-lbl">Returns</div>
                  <div
                    className={`inv-col-val${ret >= 0 ? " inv-col-val--g" : " inv-col-val--r"}`}
                  >
                    {ret >= 0 ? "+" : ""}
                    {fmtFull(Math.abs(ret))}
                  </div>
                  <div className="inv-col-sub">
                    {ret >= 0 ? "+" : ""}
                    {retPct.toFixed(2)}%
                  </div>
                </div>

                <button
                  className="btn btn--danger btn--icon"
                  title="Remove"
                  onClick={() => onDelete(inv.id)}
                >
                  <Ico.Trash />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GoalsPage({ goals, onAdd, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page">
      <div className="page__head">
        <div className="page__head-row">
          <div>
            <h1 className="page__title">Goals</h1>
            <p className="page__sub">
              Define what you're investing towards and track your progress
            </p>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => setShowModal(true)}
          >
            <Ico.Plus /> New Goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="empty">
          <div className="empty__ico">🎯</div>
          <p className="empty__title">No goals yet</p>
          <p className="empty__sub">
            Add a goal to start tracking your progress
          </p>
        </div>
      ) : (
        <div className="goal-grid">
          {goals.map((g) => {
            const pct = Math.min((g.currentSaved / g.targetAmount) * 100, 100);
            const yearsLeft = Math.max(
              new Date(g.targetDate).getFullYear() - new Date().getFullYear(),
              0,
            );
            return (
              <div className="goal-card" key={g.id}>
                <div className="goal-card__top">
                  <span className="goal-card__emoji">{g.emoji}</span>
                  <button
                    className="goal-card__del"
                    onClick={() => onDelete(g.id)}
                    title="Delete goal"
                  >
                    ✕
                  </button>
                </div>
                <div className="goal-card__name">{g.name}</div>
                <div className="goal-card__due">
                  Target · {g.targetDate} · {yearsLeft} yr
                  {yearsLeft !== 1 ? "s" : ""} left
                </div>
                <div className="goal-card__row">
                  <div>
                    <span className="goal-card__lbl">Saved</span>
                    <span className="goal-card__saved-val">
                      {fmtINR(g.currentSaved)}
                    </span>
                  </div>
                  <div>
                    <span
                      className="goal-card__lbl"
                      style={{ textAlign: "right", display: "block" }}
                    >
                      Target
                    </span>
                    <span className="goal-card__target-val">
                      {fmtINR(g.targetAmount)}
                    </span>
                  </div>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="goal-card__pct">{pct.toFixed(1)}% funded</div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddGoalModal
          onClose={() => setShowModal(false)}
          onAdd={(g) => {
            onAdd(g);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProfilePage() {
  const details = [
    { lbl: "Full Name", val: "Virat kohli" },
    { lbl: "Email", val: "virat@gmail.com" },
    { lbl: "Phone", val: "+91 1234567899" },
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
            <div className="profile-avatar">AS</div>
            <div>
              <div className="profile-name">Virat kohli</div>
              <div className="profile-email">virat@gmail.com</div>
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
          <div className="form-grp">
            <label className="form-lbl">Current Password</label>
            <input
              className="form-inp"
              type="password"
              placeholder="Enter current password"
            />
          </div>
          <div className="form-grp">
            <label className="form-lbl">New Password</label>
            <input
              className="form-inp"
              type="password"
              placeholder="Min 8 characters"
            />
          </div>
          <div className="form-grp">
            <label className="form-lbl">Confirm New Password</label>
            <input
              className="form-inp"
              type="password"
              placeholder="Re-enter new password"
            />
          </div>
          <button className="btn btn--primary" style={{ marginTop: 4 }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: <Ico.Dash /> },
    { id: "browse", label: "Browse Funds", icon: <Ico.Funds /> },
    { id: "investments", label: "My Investments", icon: <Ico.Invest /> },
    { id: "goals", label: "Goals", icon: <Ico.Goals /> },
    { id: "profile", label: "Profile", icon: <Ico.Profile /> },
  ];

  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-mark">
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
        <button className="sidebar__logout" onClick={logout}>
          <span className="sidebar__item-icon">
            <Ico.Logout />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useState(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  });
  return (
    <div className="toast">
      <span className="toast__icon">✓</span>
      {message}
    </div>
  );
}

export default function InvestorPortal() {
  const [page, setPage] = useState("dashboard");
  const [investments, setInvestments] = useState(INITIAL_INVESTMENTS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null;

  function showToast(msg) {
    setToast(msg);
  }

  function addInvestment(inv) {
    setInvestments((x) => [...x, inv]);
  }
  function deleteInvestment(id) {
    setInvestments((x) => x.filter((i) => i.id !== id));
  }
  function addGoal(g) {
    setGoals((x) => [...x, g]);
  }
  function deleteGoal(id) {
    setGoals((x) => x.filter((g) => g.id !== id));
  }

  const pageEl = {
    dashboard: <DashboardPage investments={investments} funds={FUNDS} />,
    browse: (
      <BrowseFundsPage
        investments={investments}
        funds={FUNDS}
        onAddInvestment={addInvestment}
        showToast={showToast}
      />
    ),
    investments: (
      <MyInvestmentsPage
        investments={investments}
        funds={FUNDS}
        onDelete={deleteInvestment}
      />
    ),
    goals: <GoalsPage goals={goals} onAdd={addGoal} onDelete={deleteGoal} />,
    profile: <ProfilePage />,
  }[page];

  return (
    <div className="portal">
      <Sidebar active={page} setActive={setPage} />
      <div className="portal__content">{pageEl}</div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
