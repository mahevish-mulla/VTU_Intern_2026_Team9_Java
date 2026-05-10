import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from "recharts";
import { getInvested, getCurrentVal, fmtINR } from "../utils/helpers";

const COLORS = {
  invested: "#f5a623",
  current: "#5b8dee",
};

/** Build per-fund invested vs current value data */
function buildFundComparison(investments, funds) {
  const map = new Map();

  investments.forEach((inv) => {
    const fundId = inv.mutualFund?.fundId || inv.fundId;
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) return;

    const key = fundId;
    const existing = map.get(key) || {
      name: fund.name.split(" ").slice(0, 3).join(" "),
      fullName: fund.name,
      invested: 0,
      current: 0,
    };
    existing.invested += getInvested(inv);
    existing.current += getCurrentVal(inv, funds);
    map.set(key, existing);
  });

  return Array.from(map.values())
    .filter((d) => d.invested > 0 || d.current > 0)
    .sort((a, b) => b.current - a.current);
}

/** Compact rupee format for Y-axis */
const formatY = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

/** Custom tooltip */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const inv = payload.find((p) => p.dataKey === "invested")?.value || 0;
  const cur = payload.find((p) => p.dataKey === "current")?.value || 0;
  const gain = cur - inv;
  const pct = inv > 0 ? ((gain / inv) * 100).toFixed(2) : "0.00";
  const item = payload[0]?.payload;

  return (
    <div style={{
      background: "#0e1420",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "10px",
      padding: "14px 16px",
      minWidth: "200px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
    }}>
      <div style={{
        fontSize: "12px",
        fontWeight: 600,
        color: "#eef1f8",
        marginBottom: "10px",
        paddingBottom: "8px",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        {item?.fullName || label}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#667799", padding: "3px 0" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.invested }} />
          Invested
        </span>
        <span style={{ color: "#eef1f8", fontWeight: 500 }}>{fmtINR(inv)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#667799", padding: "3px 0" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.current }} />
          Current Value
        </span>
        <span style={{ color: "#eef1f8", fontWeight: 500 }}>{fmtINR(cur)}</span>
      </div>
      <div style={{
        marginTop: "8px",
        paddingTop: "8px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        fontWeight: 700,
        color: gain >= 0 ? "#f5a623" : "#f25f5c"
      }}>
        <span>P&L</span>
        <span>{gain >= 0 ? "+" : ""}{fmtINR(Math.abs(gain))} ({gain >= 0 ? "+" : ""}{pct}%)</span>
      </div>
    </div>
  );
}

export default function PortfolioChart({ investments, funds }) {
  const data = buildFundComparison(investments, funds);

  if (data.length === 0) {
    return (
      <div className="empty">
        <div className="empty__ico">📊</div>
        <p className="empty__title">No data yet</p>
        <p className="empty__sub">Invest in funds to see your portfolio performance</p>
      </div>
    );
  }

  return (
    <>
      {/* Legend */}
      <div style={{
        display: "flex", gap: "20px", marginBottom: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#667799" }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.invested }} />
          Invested
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#667799" }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.current }} />
          Current Value
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 5, bottom: 0 }}
            barGap={2}
            barCategoryGap="30%"
          >
            <defs>
              <linearGradient id="barGradInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5a623" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#f5a623" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="barGradCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b8dee" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#5b8dee" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.04)"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#667799", fontSize: 10, fontFamily: "Epilogue" }}
              dy={8}
              interval={0}
              angle={data.length > 4 ? -25 : 0}
              textAnchor={data.length > 4 ? "end" : "middle"}
              height={data.length > 4 ? 60 : 40}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#667799", fontSize: 10, fontFamily: "Epilogue" }}
              tickFormatter={formatY}
              width={55}
            />

            <RechartsTooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(245,166,35,0.04)", radius: 4 }}
            />

            <Bar
              dataKey="invested"
              name="Invested"
              fill="url(#barGradInvested)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="current"
              name="Current Value"
              fill="url(#barGradCurrent)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
