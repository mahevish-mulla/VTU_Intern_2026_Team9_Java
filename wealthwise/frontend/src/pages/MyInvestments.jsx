import { useState, useEffect, useRef } from "react";
import { Ico } from "../utils/icons";
import { fmtFull } from "../utils/helpers";
import API from "../services/api";
import AddInvestmentModal from "../components/AddInvestmentModal";
import { downloadTransactionPDF } from "../utils/downloadTransactionPDF";

export default function MyInvestments({ investments, funds, onDelete, onRefresh, showToast, onAddInvestment }) {
  const [filter, setFilter] = useState("All");
  const [liveNavs, setLiveNavs] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [modal, setModal] = useState(null);
  const [browseFunds, setBrowseFunds] = useState([]);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);
  const menuRef = useRef(null);

  // ── Fetch live NAVs ─────────────────────────────────────────
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
    if (investments.length > 0) fetchNavs();
  }, [investments]);

  // ── Fetch funds for Add Transaction modal ───────────────────
  useEffect(() => {
    API.get("/api/funds/browse")
      .then(res => {
        const mapped = res.data
          .filter(f => f.active !== false)
          .map(f => ({
            id: f.fundId,
            name: f.fundName,
            house: f.amc?.amcName || "Unknown",
            category: f.category,
            risk: f.riskLevel,
            nav: Number(f.currentNav),
            schemeCode: f.schemeCode,
          }));
        setBrowseFunds(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  // ── Close action menu on outside click ──────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Auto-clear messages ─────────────────────────────────────
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // ── Actions ─────────────────────────────────────────────────
  const handlePause = async (id) => {
    setActionLoading(id + "_pause"); setOpenMenu(null);
    try {
      await API.put(`/api/investments/${id}/pause`);
      setMessage("SIP paused successfully"); onRefresh();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to pause SIP");
    } finally { setActionLoading(null); }
  };

  const handleResume = async (id) => {
    setActionLoading(id + "_resume"); setOpenMenu(null);
    try {
      await API.put(`/api/investments/${id}/resume`);
      setMessage("SIP resumed successfully"); onRefresh();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to resume SIP");
    } finally { setActionLoading(null); }
  };

  const handleRemove = async (id) => {
    setOpenMenu(null);
    if (!window.confirm("Are you sure you want to remove this investment?")) return;
    setActionLoading(id + "_remove");
    try {
      await API.delete(`/api/investments/${id}/remove`);
      setMessage("Investment removed successfully"); onRefresh();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to remove investment");
    } finally { setActionLoading(null); }
  };

  const handleAddTransaction = (inv) => {
    const userId = localStorage.getItem("userId") || 1;
    API.post("/api/funds/invest", {
      userId: Number(userId),
      fundId: inv.fundId,
      amount: inv.amount,
      type: inv.type,
      sipStartDate: inv.sipStartDate,
    })
      .then(() => { setMessage("Transaction added successfully"); onRefresh(); })
      .catch(err => { console.error("FULL ERROR:", err.response?.data); setMessage("Failed to add transaction"); });
  };

  // ── Download PDF ────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Get user info from localStorage / token
      const userName = localStorage.getItem("userName") || "User";
      const userEmail = localStorage.getItem("userEmail") || "";

      // Pass the currently filtered list so PDF matches what user sees
      downloadTransactionPDF({
        investments: filtered,
        funds,
        liveNavs,
        user: { name: userName, email: userEmail },
        filterLabel: filter,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      setMessage("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────
  const fmtDate = (raw) => {
    if (!raw) return "—";
    try {
      if (Array.isArray(raw)) {
        const d = new Date(raw[0], (raw[1] || 1) - 1, raw[2] || 1);
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      }
      const d = new Date(raw);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "—"; }
  };

  // ── Computed summary ────────────────────────────────────────
  const totalInvested = investments.reduce((a, inv) => a + Number(inv.amount), 0);
  const currentValue = investments.reduce((sum, inv) => {
    const fund = funds.find(f => f.id === inv.mutualFund?.fundId);
    if (!fund) return sum;
    const nav = liveNavs[fund.schemeCode] || fund.nav;
    return sum + Number(inv.units) * nav;
  }, 0);
  const totalReturn = currentValue - totalInvested;
  const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  const filtered = investments.filter(inv => {
    const fund = funds.find(f => f.id === inv.mutualFund?.fundId);
    if (!fund) return false;
    const matchesSearch = fund.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "SIP" && inv.type === "SIP") ||
      (filter === "Lumpsum" && inv.type === "LUMP_SUM");
    return matchesSearch && matchesFilter;
  });

  // ────────────────────────────────────────────────────────────
  return (
    <div className="page">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="page__head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page__title">
            Transaction <span style={{ color: "var(--green)" }}>History</span>
          </h1>
          <p className="page__sub" style={{ marginTop: "6px", fontStyle: "italic", opacity: 0.8 }}>
            Record Transactions
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "4px" }}>

          {/* Download PDF */}
          <button
            className="btn btn--outline btn--sm"
            onClick={handleDownloadPDF}
            disabled={downloading || investments.length === 0}
            title="Download transaction history as PDF"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              borderColor: "rgba(245,158,11,0.4)",
              color: "#f59e0b",
              opacity: (downloading || investments.length === 0) ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            {downloading ? (
              <>
                <SpinnerIcon />
                Generating…
              </>
            ) : (
              <>
                <DownloadIcon />
                Download PDF
              </>
            )}
          </button>

          {/* Add Transaction */}
          <button
            className="btn btn--primary btn--sm"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => { if (browseFunds.length > 0) setModal("picker"); }}
          >
            <Ico.Plus /> Add Transaction
          </button>
        </div>
      </div>

      {/* ── Message Banner ──────────────────────────────────── */}
      {message && (
        <div className="inv-msg" style={{
          padding: "10px 16px",
          marginBottom: "16px",
          borderRadius: "8px",
          background: message.includes("success") ? "#00e67622" : "#ff525222",
          color: message.includes("success") ? "#00e676" : "#ff5252",
          border: `1px solid ${message.includes("success") ? "#00e67644" : "#ff525244"}`,
        }}>
          {message}
        </div>
      )}

      {/* ── Summary Cards ───────────────────────────────────── */}
      <div className="inv-summary">
        {[
          { lbl: "Total Invested", val: fmtFull(totalInvested), cls: "" },
          { lbl: "Current Value", val: fmtFull(currentValue), cls: "" },
          {
            lbl: "Total Returns",
            val: `${totalReturn >= 0 ? "+" : ""}${fmtFull(Math.abs(totalReturn))} (${totalReturn >= 0 ? "+" : ""}${returnPct.toFixed(2)}%)`,
            cls: totalReturn >= 0 ? "--g" : "--r",
          },
          { lbl: "Transactions", val: investments.length, cls: "" },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card__hd">
              <span className="stat-card__lbl">{s.lbl}</span>
            </div>
            <div
              className={`stat-card__val${s.cls ? ` stat-card__val${s.cls}` : ""}`}
              style={s.lbl === "Total Returns" ? { whiteSpace: "nowrap" } : {}}
            >
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter Row ─────────────────────────────── */}
      <div style={{
        background: "var(--black-2)",
        border: "1px solid var(--rule)",
        borderRadius: "10px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <svg
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", width: "16px", height: "16px" }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by fund..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.2)",
              border: "1px solid var(--rule)",
              borderRadius: "6px",
              padding: "8px 14px 8px 36px",
              color: "var(--text-white)",
              fontSize: "13px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green-border)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--rule)")}
          />
        </div>

        <div className="filter-row" style={{ margin: 0, gap: "6px" }}>
          {["All", "SIP", "Lumpsum"].map((f) => (
            <button
              key={f}
              className={`filter-pill${filter === f ? " filter-pill--active" : ""}`}
              onClick={() => setFilter(f)}
              style={{ padding: "6px 12px", borderRadius: "100px", fontSize: "11px" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Investment List ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__ico">◈</div>
          <p className="empty__title">No investments found</p>
          <p className="empty__sub">Add investments from Browse Funds</p>
        </div>
      ) : (
        <div className="inv-list">
          {filtered.map((inv) => {
            const fund = funds.find(f => f.id === inv.mutualFund?.fundId);
            const nav = liveNavs[fund.schemeCode] || fund.nav;
            const invested = Number(inv.amount);
            const currentVal = Number(inv.units) * nav;
            const ret = currentVal - invested;
            const pct = (ret / invested) * 100;
            const isDeactivated = inv.mutualFund?.active === false;
            const gracePeriodEnds = inv.mutualFund?.gracePeriodEnds;
            const isPaused = inv.status === "PAUSED";
            const isStopped = inv.status === "STOPPED";

            return (
              <div
                className="inv-card"
                key={inv.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  padding: 0,
                  gap: 0,
                  border: isDeactivated ? "1px solid #f5a62344" : undefined,
                  overflow: "visible",
                  marginBottom: "8px",
                  borderRadius: "10px",
                }}
              >
                {/* Deactivated Warning */}
                {isDeactivated && (
                  <div style={{
                    background: "#f5a62322",
                    borderBottom: "1px solid #f5a62344",
                    padding: "10px 18px",
                    color: "#f5a623",
                    fontSize: "13px",
                    borderTopLeftRadius: "9px",
                    borderTopRightRadius: "9px",
                  }}>
                    ⚠️ This fund has been deactivated.
                    {gracePeriodEnds && ` Grace period ends ${Array.isArray(gracePeriodEnds)
                      ? new Date(gracePeriodEnds[0], gracePeriodEnds[1] - 1, gracePeriodEnds[2]).toLocaleDateString()
                      : new Date(gracePeriodEnds).toLocaleDateString()
                      }.`}
                    {" "}New SIP instalments will stop after grace period.
                  </div>
                )}

                {/* Stopped Warning */}
                {isStopped && (
                  <div style={{
                    background: "#ff525222",
                    borderBottom: "1px solid #ff525244",
                    padding: "10px 18px",
                    color: "#ff5252",
                    fontSize: "13px",
                    borderTopLeftRadius: isDeactivated ? "0" : "9px",
                    borderTopRightRadius: isDeactivated ? "0" : "9px",
                  }}>
                    🔴 SIP has been stopped — fund grace period has ended.
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "16px 18px" }}>

                  {/* Fund name + tags */}
                  <div style={{ flex: 1, flexShrink: 0, minWidth: 0 }}>
                    <div
                      className="inv-card__name"
                      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      title={fund.name}
                    >
                      {fund.name}
                    </div>
                    <div className="inv-card__tags">
                      <span className={`inv-tag inv-tag--${inv.type === "SIP" ? "sip" : "lumpsum"}`}>
                        {inv.type === "SIP" ? "SIP" : "Lumpsum"}
                      </span>
                      <span className="inv-tag inv-tag--cat">{fund.category}</span>
                      {isPaused && <span className="inv-tag" style={{ background: "#f5a62322", color: "#f5a623" }}>PAUSED</span>}
                      {isStopped && <span className="inv-tag" style={{ background: "#ff525222", color: "#ff5252" }}>STOPPED</span>}
                    </div>
                  </div>

                  <div className="inv-col">
                    <div className="inv-col-lbl">Date</div>
                    <div className="inv-col-val" style={{ fontSize: "12px" }}>
                      {fmtDate(inv.investmentDate || inv.investedAt || inv.createdAt || inv.date)}
                    </div>
                  </div>

                  <div className="inv-col">
                    <div className="inv-col-lbl">Invested</div>
                    <div className="inv-col-val">{fmtFull(invested)}</div>
                  </div>

                  <div className="inv-col">
                    <div className="inv-col-lbl">Buy NAV</div>
                    <div className="inv-col-val">₹{Number(inv.buyNav).toFixed(2)}</div>
                  </div>

                  <div className="inv-col">
                    <div className="inv-col-lbl">Units</div>
                    <div className="inv-col-val">{Number(inv.units).toFixed(3)}</div>
                  </div>

                  <div className="inv-col">
                    <div className="inv-col-lbl">Current Value</div>
                    <div className="inv-col-val">{fmtFull(currentVal)}</div>
                  </div>

                  <div className="inv-col">
                    <div className={`inv-col-val${ret >= 0 ? " inv-col-val--g" : " inv-col-val--r"}`}>
                      {ret >= 0 ? "+" : ""}₹{Math.abs(ret).toFixed(2)}
                    </div>
                    <div className="inv-col-sub">{ret >= 0 ? "+" : ""}{pct.toFixed(3)}%</div>
                  </div>

                  {/* ── Action Menu ── */}
                  <div className="inv-action-wrap" ref={openMenu === inv.id ? menuRef : null}>
                    <button
                      className="inv-action-btn"
                      onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)}
                      title="Actions"
                    >
                      {isPaused ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" />
                        </svg>
                      )}
                    </button>

                    {openMenu === inv.id && (
                      <div className="inv-action-menu">
                        {inv.type === "SIP" && !isStopped && (
                          isPaused ? (
                            <button
                              className="inv-action-menu__item inv-action-menu__item--green"
                              onClick={() => handleResume(inv.id)}
                              disabled={actionLoading === inv.id + "_resume"}
                            >▶ Resume SIP</button>
                          ) : (
                            <button
                              className="inv-action-menu__item inv-action-menu__item--amber"
                              onClick={() => handlePause(inv.id)}
                              disabled={actionLoading === inv.id + "_pause"}
                            >⏸ Pause SIP</button>
                          )
                        )}
                        <button
                          className="inv-action-menu__item inv-action-menu__item--red"
                          onClick={() => handleRemove(inv.id)}
                          disabled={actionLoading === inv.id + "_remove"}
                        >🗑 Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Fund Picker Modal ────────────────────────────────── */}
      {modal === "picker" && (
        <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: "520px" }}>
            <div className="modal__hd">
              <span className="modal__title">Select Fund</span>
              <button className="modal__close" onClick={() => setModal(null)}>✕</button>
            </div>
            <p className="modal__sub">Choose a fund to add a new transaction</p>
            <FundPicker funds={browseFunds} onSelect={(fund) => setModal(fund)} />
          </div>
        </div>
      )}

      {/* ── Add Investment Modal ─────────────────────────────── */}
      {modal && modal !== "picker" && (
        <AddInvestmentModal fund={modal} onClose={() => setModal(null)} onAdd={handleAddTransaction} />
      )}
    </div>
  );
}

/* ── Inline SVG icons ──────────────────────────────────────── */

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        style={{ animation: "spin 1s linear infinite", transformOrigin: "center" }} />
    </svg>
  );
}

/* ── Fund Picker ────────────────────────────────────────────── */

function FundPicker({ funds, onSelect }) {
  const [q, setQ] = useState("");
  const filtered = funds.filter(f =>
    f.name.toLowerCase().includes(q.toLowerCase()) ||
    f.house?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="form-grp">
        <input
          className="form-inp"
          type="text"
          placeholder="Search funds..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </div>
      <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "#667799", fontSize: "13px" }}>No funds found</div>
        ) : (
          filtered.slice(0, 30).map(f => (
            <button key={f.id} className="fund-picker-item" onClick={() => onSelect(f)}>
              <div>
                <div style={{ fontWeight: 500, fontSize: "13px", marginBottom: "2px" }}>{f.name}</div>
                <div style={{ fontSize: "11px", color: "#667799" }}>{f.house} · {f.category}</div>
              </div>
              <div style={{ fontFamily: "var(--font-m)", fontSize: "12px", color: "var(--green)", flexShrink: 0 }}>
                ₹{f.nav}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}



// ==================================================
// import { useState, useEffect, useRef } from "react";
// import { Ico } from "../utils/icons";
// import { fmtFull } from "../utils/helpers";
// import API from "../services/api";
// import AddInvestmentModal from "../components/AddInvestmentModal";

// export default function MyInvestments({ investments, funds, onDelete, onRefresh, showToast, onAddInvestment }) {
//   const [filter, setFilter] = useState("All");
//   const [liveNavs, setLiveNavs] = useState({});
//   const [actionLoading, setActionLoading] = useState(null);
//   const [message, setMessage] = useState("");
//   const [openMenu, setOpenMenu] = useState(null);       // which inv.id has its action menu open
//   const [modal, setModal] = useState(null);              // fund object for AddInvestmentModal
//   const [browseFunds, setBrowseFunds] = useState([]);    // funds list for "Add Transaction"
//   const [search, setSearch] = useState("");
//   const menuRef = useRef(null);

//   // Fetch live NAVs
//   useEffect(() => {
//     const fetchNavs = async () => {
//       const navMap = {};
//       for (let inv of investments) {
//         const schemeCode = inv.mutualFund?.schemeCode;
//         if (schemeCode && !navMap[schemeCode]) {
//           try {
//             const res = await API.get(`/api/funds/${schemeCode}/live`);
//             navMap[schemeCode] = Number(res.data.data.nav);
//           } catch (err) {
//             console.error(err);
//           }
//         }
//       }
//       setLiveNavs(navMap);
//     };
//     if (investments.length > 0) fetchNavs();
//   }, [investments]);

//   // Fetch funds list for "Add Transaction" modal
//   useEffect(() => {
//     API.get("/api/funds/browse")
//       .then(res => {
//         const mapped = res.data
//           .filter(f => f.active !== false)
//           .map(f => ({
//             id: f.fundId,
//             name: f.fundName,
//             house: f.amc?.amcName || "Unknown",
//             category: f.category,
//             risk: f.riskLevel,
//             nav: Number(f.currentNav),
//             schemeCode: f.schemeCode
//           }));
//         setBrowseFunds(mapped);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   // Close action menu on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setOpenMenu(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Auto-clear messages
//   useEffect(() => {
//     if (message) {
//       const t = setTimeout(() => setMessage(""), 4000);
//       return () => clearTimeout(t);
//     }
//   }, [message]);

//   const handlePause = async (id) => {
//     setActionLoading(id + "_pause");
//     setOpenMenu(null);
//     try {
//       await API.put(`/api/investments/${id}/pause`);
//       setMessage("SIP paused successfully");
//       onRefresh();
//     } catch (err) {
//       setMessage(err.response?.data?.error || "Failed to pause SIP");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleResume = async (id) => {
//     setActionLoading(id + "_resume");
//     setOpenMenu(null);
//     try {
//       await API.put(`/api/investments/${id}/resume`);
//       setMessage("SIP resumed successfully");
//       onRefresh();
//     } catch (err) {
//       setMessage(err.response?.data?.error || "Failed to resume SIP");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleRemove = async (id) => {
//     setOpenMenu(null);
//     if (!window.confirm("Are you sure you want to remove this investment?")) return;
//     setActionLoading(id + "_remove");
//     try {
//       await API.delete(`/api/investments/${id}/remove`);
//       setMessage("Investment removed successfully");
//       onRefresh();
//     } catch (err) {
//       setMessage(err.response?.data?.error || "Failed to remove investment");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Submit from "Add Transaction" modal — same logic as BrowseFunds
//   const handleAddTransaction = (inv) => {
//     const userId = localStorage.getItem("userId") || 1;
//     API.post("/api/funds/invest", {
//       userId: Number(userId),
//       fundId: inv.fundId,
//       amount: inv.amount,
//       type: inv.type,
//       sipStartDate: inv.sipStartDate
//     })
//       .then(() => {
//         setMessage("Transaction added successfully");
//         onRefresh();
//       })
//       .catch(err => {
//         console.error("FULL ERROR:", err.response?.data);
//         setMessage("Failed to add transaction");
//       });
//   };

//   // Format date helper
//   const fmtDate = (raw) => {
//     if (!raw) return "—";
//     try {
//       // Handle Java LocalDateTime array [2026,5,6,12,0,0] or ISO string
//       if (Array.isArray(raw)) {
//         const d = new Date(raw[0], (raw[1] || 1) - 1, raw[2] || 1);
//         return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//       }
//       const d = new Date(raw);
//       if (isNaN(d.getTime())) return "—";
//       return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//     } catch {
//       return "—";
//     }
//   };

//   const totalInvested = investments.reduce((a, inv) => a + Number(inv.amount), 0);
//   const currentValue = investments.reduce((sum, inv) => {
//     const fund = funds.find(f => f.id === inv.mutualFund?.fundId);
//     if (!fund) return sum;
//     const nav = liveNavs[fund.schemeCode] || fund.nav;
//     return sum + (Number(inv.units) * nav);
//   }, 0);
//   const totalReturn = currentValue - totalInvested;
//   const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

//   const filtered = investments.filter(inv => {
//     const fund = funds.find(f => f.id === inv.mutualFund?.fundId);
//     if (!fund) return false;
//     const matchesSearch = fund.name.toLowerCase().includes(search.toLowerCase());
//     const matchesFilter = filter === "All" || (filter === "SIP" ? inv.type === "SIP" : inv.type === "LUMP_SUM");
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="page">
//       {/* ── Header with + Add Transaction button ────────────── */}
//       <div className="page__head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//         <div>
//           <h1 className="page__title">Transaction <span style={{ color: "var(--green)" }}>History</span></h1>
//           <p className="page__sub" style={{ marginTop: "6px", fontStyle: "italic", opacity: 0.8 }}>Record Transactions</p>
//         </div>
//         <button
//           className="btn btn--primary btn--sm"
//           style={{ whiteSpace: "nowrap", marginTop: "4px" }}
//           onClick={() => {
//             // Open a fund picker — use first fund or show the modal
//             if (browseFunds.length > 0) {
//               setModal("picker");
//             }
//           }}
//         >
//           <Ico.Plus /> Add Transaction
//         </button>
//       </div>

//       {message && (
//         <div className="inv-msg" style={{
//           padding: "10px 16px",
//           marginBottom: "16px",
//           borderRadius: "8px",
//           background: message.includes("success") ? "#00e67622" : "#ff525222",
//           color: message.includes("success") ? "#00e676" : "#ff5252",
//           border: `1px solid ${message.includes("success") ? "#00e67644" : "#ff525244"}`
//         }}>
//           {message}
//         </div>
//       )}

//       <div className="inv-summary">
//         {[
//           { lbl: "Total Invested", val: fmtFull(totalInvested), cls: "" },
//           { lbl: "Current Value", val: fmtFull(currentValue), cls: "" },
//           {
//             lbl: "Total Returns",
//             val: `${totalReturn >= 0 ? "+" : ""}${fmtFull(Math.abs(totalReturn))} (${totalReturn >= 0 ? "+" : ""}${returnPct.toFixed(2)}%)`,
//             cls: totalReturn >= 0 ? "--g" : "--r",
//           },
//           { lbl: "Transactions", val: investments.length, cls: "" },
//         ].map((s, i) => (
//           <div className="stat-card" key={i}>
//             <div className="stat-card__hd">
//               <span className="stat-card__lbl">{s.lbl}</span>
//             </div>
//             <div className={`stat-card__val${s.cls ? ` stat-card__val${s.cls}` : ""}`} style={s.lbl === "Total Returns" ? { whiteSpace: "nowrap" } : {}}>
//               {s.val}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Search and Filter Row inside one card */}
//       <div style={{
//         background: "var(--black-2)",
//         border: "1px solid var(--rule)",
//         borderRadius: "10px",
//         padding: "12px 16px",
//         display: "flex",
//         alignItems: "center",
//         gap: "16px",
//         marginBottom: "16px"
//       }}>
//         <div style={{ position: "relative", flex: 1 }}>
//           <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//           <input
//             type="text"
//             placeholder="Search by fund..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               width: "100%",
//               background: "rgba(0,0,0,0.2)",
//               border: "1px solid var(--rule)",
//               borderRadius: "6px",
//               padding: "8px 14px 8px 36px",
//               color: "var(--text-white)",
//               fontSize: "13px",
//               outline: "none",
//               transition: "border-color 0.2s"
//             }}
//             onFocus={(e) => e.target.style.borderColor = "var(--green-border)"}
//             onBlur={(e) => e.target.style.borderColor = "var(--rule)"}
//           />
//         </div>
//         <div className="filter-row" style={{ margin: 0, gap: "6px" }}>
//           {["All", "SIP", "Lumpsum"].map((f) => (
//             <button
//               key={f}
//               className={`filter-pill${filter === f || (filter === "SIP" && f === "SIP") || (filter === "Lumpsum" && f === "Lumpsum") ? " filter-pill--active" : ""}`}
//               onClick={() => {
//                 if (f === "All" || f === "SIP" || f === "Lumpsum") setFilter(f);
//               }}
//               style={{ padding: "6px 12px", borderRadius: "100px", fontSize: "11px" }}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {filtered.length === 0 ? (
//         <div className="empty">
//           <div className="empty__ico">◈</div>
//           <p className="empty__title">No investments found</p>
//           <p className="empty__sub">Add investments from Browse Funds</p>
//         </div>
//       ) : (
//         <div className="inv-list">
//           {filtered.map((inv) => {
//             const fund = funds.find(f => f.id === inv.mutualFund?.fundId);

//             const nav = liveNavs[fund.schemeCode] || fund.nav;
//             const invested = Number(inv.amount);
//             const currentVal = Number(inv.units) * nav;
//             const ret = currentVal - invested;
//             const pct = (ret / invested) * 100;
//             const isDeactivated = inv.mutualFund?.active === false;
//             const gracePeriodEnds = inv.mutualFund?.gracePeriodEnds;
//             const isPaused = inv.status === "PAUSED";
//             const isStopped = inv.status === "STOPPED";

//             return (
//               <div
//                 className="inv-card"
//                 key={inv.id}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "stretch",
//                   padding: 0,
//                   gap: 0,
//                   border: isDeactivated ? "1px solid #f5a62344" : undefined,
//                   overflow: "visible",
//                   marginBottom: "8px",
//                   borderRadius: "10px"
//                 }}
//               >
//                 {/* Deactivated Warning Banner */}
//                 {isDeactivated && (
//                   <div style={{
//                     background: "#f5a62322",
//                     borderBottom: "1px solid #f5a62344",
//                     padding: "10px 18px",
//                     color: "#f5a623",
//                     fontSize: "13px",
//                     borderTopLeftRadius: "9px",
//                     borderTopRightRadius: "9px"
//                   }}>
//                     ⚠️ This fund has been deactivated.
//                     {gracePeriodEnds && ` Grace period ends ${Array.isArray(gracePeriodEnds) ? new Date(gracePeriodEnds[0], gracePeriodEnds[1] - 1, gracePeriodEnds[2]).toLocaleDateString() : new Date(gracePeriodEnds).toLocaleDateString()}.`}
//                     {" "}New SIP instalments will stop after grace period.
//                   </div>
//                 )}

//                 {/* Stopped Warning */}
//                 {isStopped && (
//                   <div style={{
//                     background: "#ff525222",
//                     borderBottom: "1px solid #ff525244",
//                     padding: "10px 18px",
//                     color: "#ff5252",
//                     fontSize: "13px",
//                     borderTopLeftRadius: isDeactivated ? "0" : "9px",
//                     borderTopRightRadius: isDeactivated ? "0" : "9px"
//                   }}>
//                     🔴 SIP has been stopped — fund grace period has ended.
//                   </div>
//                 )}

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "20px",
//                   padding: "16px 18px"
//                 }}>


//                   <div style={{ flex: 1, flexShrink: 0, minWidth: 0 }}>
//                     <div className="inv-card__name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={fund.name}>{fund.name}</div>
//                     <div className="inv-card__tags">
//                       <span className={`inv-tag inv-tag--${inv.type === "SIP" ? "sip" : "lumpsum"}`}>
//                         {inv.type === "SIP" ? "SIP" : "Lumpsum"}
//                       </span>
//                       <span className="inv-tag inv-tag--cat">{fund.category}</span>
//                       {isPaused && (
//                         <span className="inv-tag" style={{ background: "#f5a62322", color: "#f5a623" }}>
//                           PAUSED
//                         </span>
//                       )}
//                       {isStopped && (
//                         <span className="inv-tag" style={{ background: "#ff525222", color: "#ff5252" }}>
//                           STOPPED
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Date column */}
//                   <div className="inv-col">
//                     <div className="inv-col-lbl">Date</div>
//                     <div className="inv-col-val" style={{ fontSize: "12px" }}>
//                       {fmtDate(inv.investmentDate || inv.investedAt || inv.createdAt || inv.date)}
//                     </div>
//                   </div>

//                   <div className="inv-col">
//                     <div className="inv-col-lbl">Invested</div>
//                     <div className="inv-col-val">{fmtFull(invested)}</div>
//                   </div>

//                   <div className="inv-col">
//                     <div className="inv-col-lbl">Buy NAV</div>
//                     <div className="inv-col-val">₹{Number(inv.buyNav).toFixed(2)}</div>
//                   </div>

//                   <div className="inv-col">
//                     <div className="inv-col-lbl">Units</div>
//                     <div className="inv-col-val">{Number(inv.units).toFixed(3)}</div>
//                   </div>

//                   <div className="inv-col">
//                     <div className="inv-col-lbl">Current Value</div>
//                     <div className="inv-col-val">{fmtFull(currentVal)}</div>
//                   </div>

//                   <div className="inv-col">
//                     <div className={`inv-col-val${ret >= 0 ? " inv-col-val--g" : " inv-col-val--r"}`}>
//                       {ret >= 0 ? "+" : ""}₹{Math.abs(ret).toFixed(2)}
//                     </div>
//                     <div className="inv-col-sub">{ret >= 0 ? "+" : ""}{pct.toFixed(3)}%</div>
//                   </div>

//                   {/* ── Action Menu (three-dot) ────────────────── */}
//                   <div className="inv-action-wrap" ref={openMenu === inv.id ? menuRef : null}>
//                     <button
//                       className="inv-action-btn"
//                       onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)}
//                       title="Actions"
//                     >
//                       {isPaused ? (
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <rect x="6" y="4" width="4" height="16" />
//                           <rect x="14" y="4" width="4" height="16" />
//                         </svg>
//                       ) : (
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <polyline points="9 10 4 15 9 20" />
//                           <path d="M20 4v7a4 4 0 0 1-4 4H4" />
//                         </svg>
//                       )}
//                     </button>

//                     {openMenu === inv.id && (
//                       <div className="inv-action-menu">
//                         {/* Pause / Resume (SIP only) */}
//                         {inv.type === "SIP" && !isStopped && (
//                           isPaused ? (
//                             <button
//                               className="inv-action-menu__item inv-action-menu__item--green"
//                               onClick={() => handleResume(inv.id)}
//                               disabled={actionLoading === inv.id + "_resume"}
//                             >
//                               ▶ Resume SIP
//                             </button>
//                           ) : (
//                             <button
//                               className="inv-action-menu__item inv-action-menu__item--amber"
//                               onClick={() => handlePause(inv.id)}
//                               disabled={actionLoading === inv.id + "_pause"}
//                             >
//                               ⏸ Pause SIP
//                             </button>
//                           )
//                         )}

//                         {/* Remove */}
//                         <button
//                           className="inv-action-menu__item inv-action-menu__item--red"
//                           onClick={() => handleRemove(inv.id)}
//                           disabled={actionLoading === inv.id + "_remove"}
//                         >
//                           🗑 Remove
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* ── Fund Picker Modal (for + Add Transaction) ─────────── */}
//       {modal === "picker" && (
//         <div
//           className="modal-bg"
//           onClick={(e) => e.target === e.currentTarget && setModal(null)}
//         >
//           <div className="modal" style={{ maxWidth: "520px" }}>
//             <div className="modal__hd">
//               <span className="modal__title">Select Fund</span>
//               <button className="modal__close" onClick={() => setModal(null)}>✕</button>
//             </div>
//             <p className="modal__sub">Choose a fund to add a new transaction</p>

//             <FundPicker
//               funds={browseFunds}
//               onSelect={(fund) => setModal(fund)}
//             />
//           </div>
//         </div>
//       )}

//       {/* ── Add Investment Modal (same as BrowseFunds) ────────── */}
//       {modal && modal !== "picker" && (
//         <AddInvestmentModal
//           fund={modal}
//           onClose={() => setModal(null)}
//           onAdd={handleAddTransaction}
//         />
//       )}
//     </div>
//   );
// }

// /** Simple fund picker with search */
// function FundPicker({ funds, onSelect }) {
//   const [q, setQ] = useState("");

//   const filtered = funds.filter(f =>
//     f.name.toLowerCase().includes(q.toLowerCase()) ||
//     f.house?.toLowerCase().includes(q.toLowerCase())
//   );

//   return (
//     <div>
//       <div className="form-grp">
//         <input
//           className="form-inp"
//           type="text"
//           placeholder="Search funds..."
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           autoFocus
//         />
//       </div>
//       <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
//         {filtered.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "24px", color: "#667799", fontSize: "13px" }}>
//             No funds found
//           </div>
//         ) : (
//           filtered.slice(0, 30).map(f => (
//             <button
//               key={f.id}
//               className="fund-picker-item"
//               onClick={() => onSelect(f)}
//             >
//               <div>
//                 <div style={{ fontWeight: 500, fontSize: "13px", marginBottom: "2px" }}>{f.name}</div>
//                 <div style={{ fontSize: "11px", color: "#667799" }}>{f.house} · {f.category}</div>
//               </div>
//               <div style={{ fontFamily: "var(--font-m)", fontSize: "12px", color: "var(--green)", flexShrink: 0 }}>
//                 ₹{f.nav}
//               </div>
//             </button>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

