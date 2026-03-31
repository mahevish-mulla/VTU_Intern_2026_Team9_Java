import { useState, useEffect } from "react";
import { Ico } from "../utils/icons";
import { fmtFull } from "../utils/helpers";
import API from "../services/api";

export default function MyInvestments({ investments, funds, onDelete }) {
  const [filter, setFilter] = useState("All");
  const [liveNavs, setLiveNavs] = useState({});

  useEffect(() => {
    const fetchNavs = async () => {
      const navMap = {};

      for (let inv of investments) {
        const schemeCode = inv.mutualFund?.schemeCode;

        if (schemeCode && !navMap[schemeCode]) {
          try {
            const res = await API.get(`/api/funds/${schemeCode}/live`);
            navMap[schemeCode] = Number(res.data.data.nav);
          } catch (err) {
            console.error(err);
          }
        }
      }

      setLiveNavs(navMap);
    };

    if (investments.length > 0) {
      fetchNavs();
    }
  }, [investments]);

  const totalInvested = investments.reduce(
    (a, inv) => a + Number(inv.amount),
    0
  );

  const currentValue = investments.reduce((sum, inv) => {
    const fund = funds.find(f => f.id === inv.mutualFund?.fund_id);
    if (!fund) return sum;

    const nav = liveNavs[fund.schemeCode] || fund.nav;

    return sum + (Number(inv.units) * nav);
  }, 0);

  const totalReturn = currentValue - totalInvested;
  const returnPct =
    totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  const filtered =
    filter === "All"
      ? investments
      : investments.filter((i) =>
        filter === "SIP"
          ? i.type === "SIP"
          : i.type === "LUMP_SUM"
      );

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
          { lbl: "Current Value", val: fmtFull(currentValue), cls: "" },
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
            <div className={`stat-card__val${s.cls ? ` stat-card__val${s.cls}` : ""}`}>
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
            const fund = funds.find(
              (f) => f.id === inv.mutualFund?.fund_id
            );

            if (!fund) return null;

            const nav = liveNavs[fund.schemeCode] || fund.nav;

            const invested = Number(inv.amount);
            const currentVal = Number(inv.units) * nav;
            const ret = currentVal - invested;
            const pct = (ret / invested) * 100;

            return (
              <div className="inv-card" key={inv.id}>
                <div>
                  <div className="inv-card__name">{fund.name}</div>

                  <div className="inv-card__tags">
                    <span className={`inv-tag inv-tag--${inv.type === "SIP" ? "sip" : "lumpsum"}`}>
                      {inv.type === "SIP" ? "SIP" : "Lumpsum"}
                    </span>

                    <span className="inv-tag inv-tag--cat">
                      {fund.category}
                    </span>
                  </div>
                </div>

                <div className="inv-col">
                  <div className="inv-col-lbl">Invested</div>
                  <div className="inv-col-val">{fmtFull(invested)}</div>
                </div>

                <div className="inv-col">
                  <div className="inv-col-lbl">Current Value</div>
                  <div className="inv-col-val">{fmtFull(currentVal)}</div>
                </div>

                <div className="inv-col">
                  <div className={`inv-col-val${ret >= 0 ? " inv-col-val--g" : " inv-col-val--r"}`}>
                    {ret >= 0 ? "+" : ""}₹{Math.abs(ret).toFixed(2)}
                  </div>
                  <div className="inv-col-sub">
                    {ret >= 0 ? "+" : ""}{pct.toFixed(3)}%
                  </div>
                </div>

                <button
                  className="btn btn--danger btn--icon"
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