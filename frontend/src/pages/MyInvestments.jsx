import { useState } from "react";
import { Ico } from "../utils/icons";
import { fmtFull, getInvested, getCurrentVal } from "../utils/helpers";

export default function MyInvestments({ investments, funds, onDelete }) {
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
            val: `${totalReturn >= 0 ? "+" : ""}${fmtFull(Math.abs(totalReturn))} (${totalReturn >= 0 ? "+" : ""}${returnPct.toFixed(2)}%)`,
            cls: totalReturn >= 0 ? "--g" : "--r",
          },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card__hd">
              <span className="stat-card__lbl">{s.lbl}</span>
            </div>
            <div
              className={`stat-card__val${s.cls ? ` stat-card__val${s.cls}` : ""}`}
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
