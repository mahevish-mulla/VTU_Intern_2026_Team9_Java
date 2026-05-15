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

  const totalInvested = investments.reduce((a, inv) => a + getInvested(inv), 0);
  const currentValue = investments.reduce(
    (a, inv) => a + getCurrentVal(inv, funds),
    0,
  );
  const totalReturn = currentValue - totalInvested;
  const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  const activeSIPs = investments.filter((i) => i.type?.toUpperCase() === "SIP" && i.status !== "STOPPED");
  const monthlySIP = activeSIPs.reduce((s, inv) => s + Number(inv.amount || inv.monthlyAmount || 0), 0);

  const stats = [
    {
      lbl: "TOTAL INVESTED",
      val: fmtINR(totalInvested),
      meta: `Across ${investments.length} transaction${investments.length !== 1 ? "s" : ""}`,
      accent: "#f5a623",
    },
    {
      lbl: "CURRENT VALUE",
      val: fmtINR(currentValue),
      meta: "Live portfolio valuation",
      accent: "#5b8dee",
    },
    {
      lbl: "NET RETURNS",
      val: (totalReturn >= 0 ? "+" : "") + fmtINR(Math.abs(totalReturn)),
      meta: `${returnPct >= 0 ? "▲" : "▼"} ${Math.abs(returnPct).toFixed(2)}% overall`,
      accent: totalReturn >= 0 ? "#00e676" : "#f25f5c",
      cls: totalReturn >= 0 ? "--g" : "--r",
    },
    {
      lbl: "MONTHLY SIP",
      val: fmtINR(monthlySIP),
      meta: `${activeSIPs.length} active SIP${activeSIPs.length !== 1 ? "s" : ""} running`,
      accent: "#a78bfa",
    },
  ];

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Portfolio <em>Overview</em></h1>
        <p className="page__sub" style={{ marginTop: "6px" }}>
          Real-time snapshot of your wealth — powered by live NAV data
        </p>
      </div>

      {/* ── Hero: Total Portfolio Value ── */}
      <div className="stat-card" style={{ marginBottom: "14px", padding: "28px 28px 24px", borderLeft: "3px solid var(--green)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: "var(--green)", opacity: 0.04, borderRadius: "0 0 0 120px" }} />
        <div className="stat-card__lbl" style={{ marginBottom: "12px" }}>PORTFOLIO OVERVIEW</div>
        <div className="stat-card__val" style={{ fontSize: "34px", marginBottom: "10px" }}>
          {fmtINR(currentValue)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <span style={{ color: "var(--text-dim)", fontSize: "13px" }}>Net profit</span>
          <span style={{ color: totalReturn >= 0 ? "#00e676" : "#f25f5c", fontFamily: "var(--font-m)", fontSize: "13px", fontWeight: 600 }}>
            {totalReturn >= 0 ? "▲" : "▼"} {fmtINR(Math.abs(totalReturn))}
          </span>
          <span style={{ color: totalReturn >= 0 ? "#00e676" : "#f25f5c", fontFamily: "var(--font-m)", fontSize: "13px", fontWeight: 600 }}>
            {totalReturn >= 0 ? "▲" : "▼"} {Math.abs(returnPct).toFixed(2)}%
          </span>
        </div>
        <div style={{ color: "var(--text-dim)", fontSize: "11px", marginTop: "10px", opacity: 0.7, fontStyle: "italic" }}>
          Marked to market as of the latest NAV cycle
        </div>
      </div>

      {/* ── 3 Stat Cards Below ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "22px" }}>
        <div className="stat-card" style={{ borderLeft: "3px solid #f5a623", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "50px", height: "50px", background: "#f5a623", opacity: 0.04, borderRadius: "0 0 0 50px" }} />
          <div className="stat-card__hd"><span className="stat-card__lbl">TOTAL INVESTED</span></div>
          <div className="stat-card__val">{fmtINR(totalInvested)}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: `3px solid ${totalReturn >= 0 ? "#00e676" : "#f25f5c"}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "50px", height: "50px", background: totalReturn >= 0 ? "#00e676" : "#f25f5c", opacity: 0.04, borderRadius: "0 0 0 50px" }} />
          <div className="stat-card__hd"><span className="stat-card__lbl">{totalReturn >= 0 ? "↗" : "↘"} TOTAL GAIN / LOSS</span></div>
          <div className={`stat-card__val stat-card__val${totalReturn >= 0 ? "--g" : "--r"}`}>
            {totalReturn >= 0 ? "+" : ""}{fmtINR(Math.abs(totalReturn))}
          </div>
          <div className="stat-card__meta" style={{ color: totalReturn >= 0 ? "#00e676" : "#f25f5c" }}>
            {totalReturn >= 0 ? "+" : ""}{returnPct.toFixed(2)}% absolute return
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: "3px solid #a78bfa", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "50px", height: "50px", background: "#a78bfa", opacity: 0.04, borderRadius: "0 0 0 50px" }} />
          <div className="stat-card__hd"><span className="stat-card__lbl">ACTIVE SIPs</span></div>
          <div className="stat-card__val">{activeSIPs.length}</div>
          <div className="stat-card__meta">{fmtINR(monthlySIP)}/mo outflow</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card__label">PORTFOLIO PERFORMANCE</div>
          <PortfolioChart investments={investments} funds={funds} />
        </div>
        <div className="card">
          <div className="card__label">ASSET ALLOCATION</div>
          <AllocationDonut investments={investments} funds={funds} />
        </div>
      </div>

      <div className="dash-grid-b">
        <div className="card">
          <div className="card__label">ACTIVE HOLDINGS</div>
          {investments.length === 0 ? (
            <div className="empty">
              <div className="empty__ico">◈</div>
              <p className="empty__title">No investments yet</p>
              <p className="empty__sub">
                Head to Fund Discovery to build your portfolio
              </p>
            </div>
          ) : (
            <div className="holding-list">
              {investments.map((inv) => {
                const fund = funds.find((f) => f.id === inv.mutualFund?.fundId);
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
                        {inv.type?.toUpperCase() === "SIP"
                          ? `SIP ₹${(inv.amount || inv.monthlyAmount || 0).toLocaleString("en-IN")}/mo`
                          : "Lumpsum"}
                      </div>
                    </div>
                    <div className="holding-right">
                      <div className="holding-val">{fmtFull(val)}</div>
                      <span
                        className={`holding-ret holding-ret--${ret >= 0 ? "up" : "down"}`}
                      >
                        {ret >= 0 ? "▲" : "▼"} {Math.abs(retPct).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card__label">UPCOMING SIP SCHEDULE</div>
          {activeSIPs.length === 0 ? (
            <div className="empty">
              <div className="empty__ico">🔄</div>
              <p className="empty__sub">No active SIPs</p>
            </div>
          ) : (
            <div className="sip-list">
              {activeSIPs.map((inv) => {
                const fund = funds.find((f) => f.id === inv.mutualFund?.fundId);
                return (
                  <div className="sip-row" key={inv.id}>
                    <div>
                      <div className="sip-row__name">{fund?.name}</div>
                      <div className="sip-row__date">Due {inv.nextDueDate || inv.nextSIP || "—"}</div>
                    </div>
                    <div className="sip-row__amt">
                      {fmtFull(inv.amount || inv.monthlyAmount || 0)}
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
