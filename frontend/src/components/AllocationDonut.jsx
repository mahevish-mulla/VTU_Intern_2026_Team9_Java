import { FUND_COLORS } from "../utils/data";
import { getCurrentVal } from "../utils/helpers";

export default function AllocationDonut({ investments, funds }) {
  if (!investments.length) {
    return (
      <div className="empty">
        <div className="empty__ico">◎</div>
        <p className="empty__sub">No investments yet</p>
      </div>
    );
  }

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
    sw = 13;
  const circ = 2 * Math.PI * r;
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
