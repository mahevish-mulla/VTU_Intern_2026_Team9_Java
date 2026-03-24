import { useState } from "react";
import PortfolioChart from "../components/PortfolioChart";
import AllocationDonut from "../components/AllocationDonut";
import {
  fmtINR,
  fmtFull,
  abbr,
  getInvested,
  getCurrentVal,
} from "../utils/helpers";

export default function Dashboard({ investments, funds }) {
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
