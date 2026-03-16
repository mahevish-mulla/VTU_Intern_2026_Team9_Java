import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Sparkline({ data, up, width = 72, height = 28 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  const fill = `0,${height} ${pts} ${width},${height}`;
  const color = up ? "#00e676" : "#ff5252";
  const gid = up ? "sgUp" : "sgDown";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="terminal__holding-spark"
      overflow="visible"
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.26" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#${gid})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroChart() {
  const W = 540,
    H = 170;
  const raw = [
    88, 82, 96, 90, 110, 104, 124, 118, 138, 130, 150, 144, 158, 152, 164, 158,
    174, 168, 182, 176, 190, 184, 198,
  ];
  const max = Math.max(...raw),
    min = Math.min(...raw),
    range = max - min;

  const pts = raw.map((v, i) => [
    (i / (raw.length - 1)) * W,
    H - 8 - ((v - min) / range) * (H - 18),
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
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      overflow="visible"
    >
      <defs>
        <linearGradient id="heroGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00e676" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0.32, 0.64].map((t, i) => (
        <line
          key={i}
          x1={0}
          y1={H * t}
          x2={W}
          y2={H * t}
          stroke="rgba(0,230,118,0.055)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      <path d={area} fill="url(#heroGrad)" />
      <path
        d={curve}
        fill="none"
        stroke="#00e676"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#glow)"
        className="terminal__chart-line"
      />
      <circle cx={lx} cy={ly} r={9} fill="rgba(0,230,118,0.16)" />
      <circle cx={lx} cy={ly} r={4.5} fill="#00e676" filter="url(#glow)" />
    </svg>
  );
}

const TICKERS = [
  { sym: "RELIANCE", val: "2,941.50", chg: "+0.84%", up: true },
  { sym: "TCS", val: "3,812.40", chg: "+1.12%", up: true },
  { sym: "HDFCBANK", val: "1,642.30", chg: "-0.38%", up: false },
  { sym: "INFY", val: "1,478.90", chg: "+0.67%", up: true },
  { sym: "ICICIBANK", val: "1,102.50", chg: "+1.43%", up: true },
  { sym: "ITC", val: "432.70", chg: "-0.14%", up: false },
  { sym: "BAJFINANCE", val: "6,940.00", chg: "+2.01%", up: true },
  { sym: "WIPRO", val: "468.35", chg: "+0.52%", up: true },
  { sym: "MARUTI", val: "10,230.00", chg: "-0.72%", up: false },
  { sym: "NIFTY 50", val: "22,147.00", chg: "+0.41%", up: true },
];

const HOLDINGS = [
  {
    name: "Mirae Asset Emerging Bluechip",
    sym: "MF",
    type: "Large & Mid Cap",
    meta: "SIP · ₹5,000/mo",
    val: "₹85,420",
    xirr: "+14.2% XIRR",
    up: true,
    data: [80, 82, 79, 85, 88, 84, 90, 93, 89, 96],
  },
  {
    name: "Parag Parikh Flexi Cap",
    sym: "MF",
    type: "Flexi Cap",
    meta: "Lumpsum · ₹50,000",
    val: "₹64,310",
    xirr: "+12.8% XIRR",
    up: true,
    data: [70, 73, 71, 76, 74, 80, 78, 84, 82, 88],
  },
  {
    name: "SBI Small Cap Fund",
    sym: "MF",
    type: "Small Cap",
    meta: "SIP · ₹3,000/mo",
    val: "₹38,740",
    xirr: "+9.4% XIRR",
    up: true,
    data: [60, 58, 63, 61, 66, 64, 68, 65, 70, 67],
  },
];

const CHART_TABS = ["1M", "3M", "6M", "1Y", "3Y", "ALL"];

const STEPS = [
  {
    num: "01",
    icon: "⊕",
    title: "Add your investments",
    desc: "Log your SIP or lumpsum purchases from Groww, Zerodha, Kite, or any platform. Just fund name, amount, and date.",
  },
  {
    num: "02",
    icon: "◎",
    title: "We fetch live NAVs",
    desc: "WealthWise pulls the latest NAV data via mfAPI for every mutual fund you hold — fully automatic, always fresh.",
  },
  {
    num: "03",
    icon: "◈",
    title: "See your full picture",
    desc: "Current value, invested amount, absolute returns, XIRR — everything calculated and displayed in one clean dashboard.",
  },
];

const WHAT_CARDS = [
  {
    icon: "◈",
    title: "Current Value",
    desc: "Live NAV × units held, updated daily from mfAPI across all your funds.",
  },
  {
    icon: "⬡",
    title: "XIRR / Absolute Return",
    desc: "Extended IRR calculated per fund and across your entire portfolio.",
  },
  {
    icon: "◎",
    title: "SIP Tracker",
    desc: "Track every instalment — scheduled, executed, and upcoming — in one view.",
  },
  {
    icon: "⬘",
    title: "Invested vs Value",
    desc: "See exactly how much you put in vs what it's worth today, fund by fund.",
  },
  {
    icon: "◉",
    title: "Fund-wise Breakdown",
    desc: "Split by category: large cap, mid cap, small cap, ELSS, debt, and more.",
  },
  {
    icon: "⬟",
    title: "Goal Mapping",
    desc: "Attach investments to goals — retirement, house, education — and track progress.",
  },
  {
    icon: "◆",
    title: "NAV History",
    desc: "Full historical NAV chart for each fund so you can zoom in on any period.",
  },
  {
    icon: "⊞",
    title: "Multi-Platform View",
    desc: "Investments from Groww, Zerodha, Kite, Upstox — all in one consolidated view.",
  },
];

const SNAPSHOT_FUNDS = [
  {
    name: "Mirae Asset Emerging Bluechip",
    meta: "Large & Mid Cap",
    val: "₹85,420",
    xirr: "+14.2%",
  },
  {
    name: "Parag Parikh Flexi Cap",
    meta: "Flexi Cap",
    val: "₹64,310",
    xirr: "+12.8%",
  },
  {
    name: "Axis Bluechip Fund",
    meta: "Large Cap",
    val: "₹41,880",
    xirr: "+11.1%",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("1Y");
  const tickerItems = [...TICKERS, ...TICKERS];
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="ticker">
        <div className="ticker__track">
          {tickerItems.map((t, i) => (
            <span className="ticker__item" key={i}>
              <span className="ticker__sym">{t.sym}</span>
              <span className="ticker__val">₹{t.val}</span>
              <span
                className={`ticker__chg ticker__chg--${t.up ? "up" : "down"}`}
              >
                {t.up ? "▲" : "▼"} {t.chg}
              </span>
              <span className="ticker__sep">|</span>
            </span>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="hero__grid-bg" />
        <div className="hero__orb" />
        <div className="hero__scanline" />

        <div className="hero__inner">
          <div>
            <div className="hero__rule fade-up" />
            <h1 className="hero__headline fade-up delay-1">
              All your Investments in
              <br />
              One <em>Organized</em>
              <br />
              dashboard.
            </h1>
            <p className="hero__sub fade-up delay-2">
              Track SIPs, funds, and portfolios from multiple platforms in one
              place. WealthWise calculates real-time value, returns, and
              portfolio insights using live NAV data.
            </p>
            <div className="hero__actions fade-up delay-3">
              <button
                className="btn-primary"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard →
              </button>
            </div>
          </div>

          <div className="terminal-wrap fade-up delay-2">
            <div className="terminal-nav-float">
              <span className="terminal-nav-float__label">Today's Gain</span>
              <span className="terminal-nav-float__val">+₹1,240.80</span>
            </div>

            <div className="terminal">
              <div className="terminal__bar">
                <span className="terminal__dot terminal__dot--r" />
                <span className="terminal__dot terminal__dot--y" />
                <span className="terminal__dot terminal__dot--g" />
                <span className="terminal__bar-title">
                  wealthwise — portfolio
                </span>
              </div>

              <div className="terminal__body">
                <div className="terminal__value-row">
                  <div>
                    <span className="terminal__label">Current Value</span>
                    <span className="terminal__value">
                      ₹1,88,470
                      <span className="terminal__value-cents">.42</span>
                    </span>
                  </div>
                  <span className="terminal__badge terminal__badge--up">
                    ▲ +18.4% XIRR
                  </span>
                </div>

                <div className="terminal__tabs">
                  {CHART_TABS.map((t) => (
                    <button
                      key={t}
                      className={`terminal__tab${activeTab === t ? " terminal__tab--active" : ""}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="terminal__chart">
                  <HeroChart />
                </div>

                <div className="terminal__holdings">
                  {HOLDINGS.map((h) => (
                    <div className="terminal__holding" key={h.name}>
                      <div className="terminal__holding-icon">{h.sym}</div>
                      <div className="terminal__holding-info">
                        <div className="terminal__holding-name">{h.name}</div>
                        <div className="terminal__holding-type">{h.type}</div>
                        <div className="terminal__holding-meta">{h.meta}</div>
                      </div>
                      <Sparkline data={h.data} up={h.up} />
                      <div>
                        <div className="terminal__holding-price">{h.val}</div>
                        <span
                          className={`terminal__holding-change terminal__holding-change--${h.up ? "up" : "down"}`}
                        >
                          {h.xirr}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-rule" />

      <section className="how">
        <div className="how__inner">
          <div className="how__header">
            <div className="eyebrow">How It Works</div>
            <h2 className="how__headline">
              Three steps to see
              <br />
              <em>everything at once</em>
            </h2>
            <p className="how__sub">
              No brokerage API keys. No broker login. Just log your investments
              and let WealthWise do the rest
            </p>
          </div>

          <div className="how__steps">
            {STEPS.map((s, i) => (
              <div className="how__step" key={i}>
                <div className="how__step-num">{s.num}</div>
                <span className="how__step-icon">{s.icon}</span>
                <h3 className="how__step-title">{s.title}</h3>
                <p className="how__step-desc">{s.desc}</p>
                <div className="how__step-connector">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="what">
        <div className="what__inner">
          <div className="what__header">
            <div>
              <div className="eyebrow">Dashboard Highlights</div>
              <h2 className="what__headline">
                Everything you need
                <br />
                <em>to track. Nothing more.</em>
              </h2>
            </div>
            <p className="what__desc">
              No bloat. No noise. WealthWise shows you exactly what matters —
              your money's current value, how much it's grown, and how each fund
              is performing.
            </p>
          </div>

          <div className="what__grid">
            {WHAT_CARDS.map((c, i) => (
              <div className="what__card" key={i}>
                <span className="what__card-icon">{c.icon}</span>
                <h3 className="what__card-title">{c.title}</h3>
                <p className="what__card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-rule" />

      <section className="cta-strip">
        <div className="cta-strip__inner">
          <div className="cta-strip__grid-bg" />
          <div className="cta-strip__orb" />
          <div className="cta-strip__scanline" />

          <div className="cta-strip__content">
            <h2 className="cta-strip__headline">
              Start tracking
              <br />
              <em>your Investments</em>
              <br />
              today
            </h2>
            <p className="cta-strip__sub">
              Stop switching between apps to check your Groww SIPs and Zerodha
              holdings. Add them once, and WealthWise keeps your complete
              picture up to date — always.
            </p>
            <div className="cta-strip__actions">
              <button
                className="btn-primary"
                onClick={() => navigate("/dashboard")}
              >
                Get started →
              </button>
            </div>
            <span className="cta-strip__trust">
              Free to use · No brokerage login needed
            </span>
          </div>
          <div className="cta-strip__snapshot">
            <div className="snapshot">
              <div className="snapshot__title">
                <span className="snapshot__title-dot" />
                My Portfolio Snapshot
              </div>

              <div className="snapshot__rows">
                {SNAPSHOT_FUNDS.map((f, i) => (
                  <div className="snapshot__row" key={i}>
                    <div className="snapshot__row-left">
                      <span className="snapshot__row-name">{f.name}</span>
                      <span className="snapshot__row-meta">{f.meta}</span>
                    </div>
                    <div className="snapshot__row-right">
                      <span className="snapshot__row-val">{f.val}</span>
                      <span className="snapshot__row-xirr snapshot__row-xirr--up">
                        {f.xirr} XIRR
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="snapshot__footer">
                <span className="snapshot__footer-label">Total Value</span>
                <span className="snapshot__footer-val">₹1,91,610</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
