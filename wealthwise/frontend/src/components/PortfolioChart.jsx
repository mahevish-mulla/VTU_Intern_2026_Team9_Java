import { CHART_DATA } from "../utils/data";

export default function PortfolioChart({ period, setPeriod }) {
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
            <stop offset="0%" stopColor="#f5a623" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
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
          stroke="#f5a623"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#cgl)"
          className="chart-line"
        />
        <circle cx={lx} cy={ly} r={7} fill="rgba(245,166,35,0.18)" />
        <circle cx={lx} cy={ly} r={3.5} fill="#f5a623" filter="url(#cgl)" />
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
