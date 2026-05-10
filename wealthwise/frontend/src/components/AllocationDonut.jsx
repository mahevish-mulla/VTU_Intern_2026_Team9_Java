import { useState } from "react";
import { FUND_COLORS } from "../utils/data";
import { getCurrentVal, fmtINR } from "../utils/helpers";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";

/** Custom active-shape renderer for the donut hover effect */
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.95}
      />
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#eef1f8"
        fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="600">
        {fmtINR(value)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#667799"
        fontFamily="Epilogue, sans-serif" fontSize="11" fontWeight="400">
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

export default function AllocationDonut({ investments, funds }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!investments.length) {
    return (
      <div className="empty">
        <div className="empty__ico">◎</div>
        <p className="empty__sub">No investments yet</p>
      </div>
    );
  }

  const items = investments.map((inv, i) => {
    const fundId = inv.mutualFund?.fundId || inv.fundId;
    const f = funds.find((x) => x.id === fundId);
    return {
      name: f?.name ? f.name.split(" ").slice(0, 4).join(" ") : "Unknown",
      value: getCurrentVal(inv, funds),
      color: FUND_COLORS[i % FUND_COLORS.length],
    };
  }).filter(it => it.value > 0);

  const totalValue = items.reduce((s, it) => s + it.value, 0);

  return (
    <div className="alloc-stack">
      {/* Donut */}
      <div className="alloc-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIdx}
              activeShape={renderActiveShape}
              data={items}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIdx(index)}
              stroke="none"
            >
              {items.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Simple 2-column text legend below */}
      <div className="alloc-legend-grid">
        {items.map((item, i) => {
          const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
          return (
            <div
              className="alloc-legend-row"
              key={i}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <span className="alloc-legend-dot" style={{ background: item.color }} />
              <span className="alloc-legend-name">{item.name}</span>
              <span className="alloc-legend-pct">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
