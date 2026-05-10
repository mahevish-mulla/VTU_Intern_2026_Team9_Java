import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fmtINR } from "../utils/helpers";
import "../styles/estimator.css";

export default function ReturnsEstimator({ onNavigate, onSetGoalAmount }) {
  const [mode, setMode] = useState("sip");
  const [amount, setAmount] = useState(5000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(12);

  const isSIP = mode === "sip";
  const minAmount = isSIP ? 500 : 5000;
  const maxAmount = isSIP ? 100000 : 10000000;
  const stepAmount = isSIP ? 500 : 5000;

  // Calculate
  const { invested, returns, total, chartData, investedPct, returnsPct } = useMemo(() => {
    let inv = 0;
    let fv = 0;
    const data = [];

    if (isSIP) {
      inv = amount * 12 * years;
      const monthlyRate = rate / 12 / 100;
      const months = years * 12;
      fv = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

      for (let i = 0; i <= years; i++) {
        const m = i * 12;
        const currentInv = amount * m;
        const currentFv = m === 0 ? 0 : amount * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
        data.push({
          year: `Year ${i}`,
          Invested: Math.round(currentInv),
          Returns: Math.round(Math.max(0, currentFv - currentInv))
        });
      }
    } else {
      inv = amount;
      const r = rate / 100;
      fv = amount * Math.pow(1 + r, years);

      for (let i = 0; i <= years; i++) {
        const currentFv = amount * Math.pow(1 + r, i);
        data.push({
          year: `Year ${i}`,
          Invested: Math.round(inv),
          Returns: Math.round(Math.max(0, currentFv - inv))
        });
      }
    }

    const ret = Math.max(0, fv - inv);
    const t = fv;
    const invPct = t > 0 ? (inv / t) * 100 : 0;
    const retPct = t > 0 ? (ret / t) * 100 : 0;

    return {
      invested: Math.round(inv),
      returns: Math.round(ret),
      total: Math.round(t),
      chartData: data,
      investedPct: invPct,
      returnsPct: retPct
    };
  }, [mode, amount, years, rate, isSIP]);

  const handleAmountInput = (e) => {
    const val = e.target.value;
    if (val === "") { setAmount(0); return; }
    const num = parseInt(val, 10);
    if (!isNaN(num)) setAmount(num);
  };

  const handleAmountBlur = () => {
    if (amount < minAmount) setAmount(minAmount);
    else if (amount > maxAmount) setAmount(maxAmount);
  };

  const handleSliderChange = (e) => setAmount(Number(e.target.value));
  const handleYearsChange = (e) => setYears(Number(e.target.value));
  const handleRateChange = (e) => setRate(Number(e.target.value));

  const handleSetAsGoal = () => {
    if (onSetGoalAmount) onSetGoalAmount(total);
    if (onNavigate) onNavigate("goals");
  };

  // Slider fill percentage for gradient track
  const amountFillPct = ((amount - minAmount) / (maxAmount - minAmount)) * 100;
  const yearsFillPct = ((years - 1) / 29) * 100;
  const rateFillPct = ((rate - 1) / 29) * 100;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const inv = payload.find(p => p.dataKey === "Invested")?.value || 0;
      const ret = payload.find(p => p.dataKey === "Returns")?.value || 0;
      return (
        <div className="est-tooltip">
          <div className="est-tooltip__title">{label}</div>
          <div className="est-tooltip__row">
            <span className="est-tooltip__dot" style={{ background: "#f5a623" }} />
            <span>Invested</span>
            <span className="est-tooltip__val">{fmtINR(inv)}</span>
          </div>
          <div className="est-tooltip__row">
            <span className="est-tooltip__dot" style={{ background: "#5b8af5" }} />
            <span>Returns</span>
            <span className="est-tooltip__val">{fmtINR(ret)}</span>
          </div>
          <div className="est-tooltip__total">
            <span>Total Value</span>
            <span>{fmtINR(inv + ret)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page estimator-page">
      <div className="page__head">
        <div className="page__head-row">
          <div>
            <h1 className="page__title">Returns <em>Estimator</em></h1>
            <p className="page__sub">Plan your investments and visualise projected growth over time</p>
          </div>
        </div>
      </div>

      <div className="est-grid">
        {/* ──────────── LEFT COLUMN: Inputs + Summary ──────────── */}
        <div className="est-left">

          {/* Input Panel */}
          <div className="est-card">
            <div className="est-tabs">
              <button
                className={`est-tab ${isSIP ? "est-tab--active" : ""}`}
                onClick={() => { setMode("sip"); setAmount(5000); }}
              >
                <span className="est-tab__icon">🔄</span>
                SIP (Monthly)
              </button>
              <button
                className={`est-tab ${!isSIP ? "est-tab--active" : ""}`}
                onClick={() => { setMode("lumpsum"); setAmount(100000); }}
              >
                <span className="est-tab__icon">💰</span>
                Lumpsum
              </button>
            </div>

            {/* Amount */}
            <div className="est-field">
              <label className="est-field__label">
                {isSIP ? "Monthly Investment" : "Investment Amount"}
              </label>
              <div className="est-field__input-wrap">
                <span className="est-field__prefix">₹</span>
                <input
                  id="estimator-amount"
                  type="number"
                  className="est-field__input"
                  value={amount || ""}
                  onChange={handleAmountInput}
                  onBlur={handleAmountBlur}
                  min={minAmount}
                  max={maxAmount}
                  step={stepAmount}
                  placeholder={String(minAmount)}
                />
              </div>
              <div className="est-field__slider-row">
                <span className="est-field__range-label">{fmtINR(minAmount)}</span>
                <input
                  type="range"
                  className="est-slider"
                  style={{ "--fill": `${amountFillPct}%` }}
                  min={minAmount}
                  max={maxAmount}
                  step={stepAmount}
                  value={Math.max(minAmount, Math.min(maxAmount, amount))}
                  onChange={handleSliderChange}
                />
                <span className="est-field__range-label">{fmtINR(maxAmount)}</span>
              </div>
              {amount < minAmount && amount !== 0 && (
                <div className="est-field__error">
                  Minimum {isSIP ? "SIP" : "lumpsum"} amount is {fmtINR(minAmount)}
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="est-field">
              <div className="est-field__head">
                <label className="est-field__label">Investment Duration</label>
                <div className="est-field__badge">{years} {years === 1 ? "Year" : "Years"}</div>
              </div>
              <div className="est-field__slider-row">
                <span className="est-field__range-label">1 Yr</span>
                <input
                  type="range"
                  className="est-slider"
                  style={{ "--fill": `${yearsFillPct}%` }}
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={handleYearsChange}
                />
                <span className="est-field__range-label">30 Yrs</span>
              </div>
            </div>

            {/* Rate */}
            <div className="est-field" style={{ marginBottom: 0 }}>
              <div className="est-field__head">
                <label className="est-field__label">Expected Return Rate (p.a.)</label>
                <div className="est-field__badge">{rate}%</div>
              </div>
              <div className="est-field__slider-row">
                <span className="est-field__range-label">1%</span>
                <input
                  type="range"
                  className="est-slider"
                  style={{ "--fill": `${rateFillPct}%` }}
                  min={1}
                  max={30}
                  step={0.5}
                  value={rate}
                  onChange={handleRateChange}
                />
                <span className="est-field__range-label">30%</span>
              </div>
            </div>
          </div>

          {/* Summary Cards — below the form */}
          <div className="est-results">
            <div className="est-result-card est-result-card--total">
              <div className="est-result-card__label">Total Estimated Value</div>
              <div className="est-result-card__value est-result-card__value--big">{fmtINR(total)}</div>
            </div>
            <div className="est-result-pair">
              <div className="est-result-card">
                <div className="est-result-card__label">
                  <span className="est-dot" style={{ background: "#f5a623" }} />
                  Total Invested
                </div>
                <div className="est-result-card__value">{fmtINR(invested)}</div>
              </div>
              <div className="est-result-card">
                <div className="est-result-card__label">
                  <span className="est-dot" style={{ background: "#5b8af5" }} />
                  Est. Returns
                </div>
                <div className="est-result-card__value" style={{ color: "#10b981" }}>
                  +{fmtINR(returns)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────── RIGHT COLUMN: Chart + CTA ──────────── */}
        <div className="est-right">
          <div className="est-card">
            <div className="est-chart-header">
              <h2 className="est-chart-title">Projected Wealth Growth</h2>
              <p className="est-chart-sub">
                Year-by-year breakdown of your {isSIP ? "SIP" : "lumpsum"} investment growth at {rate}% p.a.
              </p>
            </div>

            <div className="est-chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f5a623" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#f5a623" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="gradReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5b8af5" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#5b8af5" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#667799", fontFamily: "Epilogue" }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#667799", fontFamily: "Epilogue" }}
                    tickFormatter={(val) => {
                      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
                      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
                      return `₹${val}`;
                    }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(245,166,35,0.3)", strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="Invested"
                    stackId="1"
                    stroke="#f5a623"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradInvested)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#f5a623", stroke: "#0e1420", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Returns"
                    stackId="1"
                    stroke="#5b8af5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradReturns)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#5b8af5", stroke: "#0e1420", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="est-legend">
              <div className="est-legend__item">
                <span className="est-legend__color" style={{ background: "#f5a623" }} />
                <span>Invested ({investedPct.toFixed(0)}%)</span>
              </div>
              <div className="est-legend__item">
                <span className="est-legend__color" style={{ background: "#5b8af5" }} />
                <span>Returns ({returnsPct.toFixed(0)}%)</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="est-progress-wrap">
              <div className="est-progress">
                <div className="est-progress__bar est-progress__bar--invested" style={{ width: `${investedPct}%` }} />
                <div className="est-progress__bar est-progress__bar--returns" style={{ width: `${returnsPct}%` }} />
              </div>
            </div>

            {/* Set as Goal */}
            <button className="est-goal-btn" onClick={handleSetAsGoal}>
              <span className="est-goal-btn__icon">🎯</span>
              Set as Goal — {fmtINR(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
