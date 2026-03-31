import { useState, useMemo, useEffect } from "react";
import AddInvestmentModal from "../components/AddInvestmentModal";
import { CATEGORIES } from "../utils/data";
import { Ico } from "../utils/icons";
import API from "../services/api";

export default function BrowseFunds({
  investments,
  showToast,
  onAddInvestment
}) {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [cat, setCat] = useState("All");
  const [modal, setModal] = useState(null);
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    API.get("/api/funds/browse")
      .then(res => setFunds(res.data))
      .catch(err => console.error(err));
  }, []);

  const mappedFunds = funds.map(f => ({
    id: f.fund_id,
    name: f.fundName,
    house: f.amc?.amcName || "Unknown",
    category: f.category,
    risk: f.riskLevel,
    nav: Number(f.currentNav),
    schemeCode: f.schemeCode
  }));

  const ownedFundIds = new Set(
    investments.map((i) => i.mutualFund?.fund_id)
  );

  const filtered = useMemo(() => {
    return mappedFunds.filter((f) => {
      const matchQ =
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.house.toLowerCase().includes(query.toLowerCase());

      const matchR =
        risk === "All" || f.risk.toUpperCase() === risk.toUpperCase();

      const matchC = cat === "All" || f.category === cat;

      return matchQ && matchR && matchC;
    });
  }, [mappedFunds, query, risk, cat]);

  function handleAdd(inv) {
    const userId = localStorage.getItem("userId") || 1;

    API.post("/api/funds/invest", {
      userId: Number(userId),
      fundId: inv.fundId,
      amount: inv.amount,
      type: inv.type
    })
      .then(res => {
        showToast("Added to your portfolio!");
        onAddInvestment(res.data);
      })
      .catch(err => {
        console.error("FULL ERROR:", err.response?.data);
      });
  }

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Browse Funds</h1>
        <p className="page__sub">
          Explore mutual funds and add them to your portfolio
        </p>
      </div>

      <div className="browse-bar">
        <div className="search-wrap">
          <span className="search-ico">
            <Ico.Search />
          </span>
          <input
            className="search-input"
            placeholder="Search by fund name or AMC..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="risk-filter"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          <option value="All">All Risk</option>
          <option value="LOW">Low Risk</option>
          <option value="MEDIUM">Moderate Risk</option>
          <option value="HIGH">High Risk</option>
        </select>
      </div>

      <div className="cat-strip">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-pill${cat === c ? " cat-pill--active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="fund-grid">
        {filtered.map((f) => (
          <div className="fund-card" key={f.id}>
            <div className="fund-card__top">
              <div>
                <div className="fund-card__name">{f.name}</div>
                <div className="fund-card__house">{f.house}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span className={`badge badge--${f.risk.toLowerCase()}`}>
                  {f.risk}
                </span>

                {ownedFundIds.has(f.id) && (
                  <span className="fund-card__owned-badge">Invested</span>
                )}
              </div>
            </div>

            <div className="fund-card__stats">
              <div>
                <div className="fund-stat-lbl">Category</div>
                <div className="fund-stat-val">{f.category}</div>
              </div>

              <div>
                <div className="fund-stat-lbl">NAV</div>
                <div className="fund-stat-val">
                  ₹{f.nav.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="fund-card__btns">
              <button
                className="btn btn--primary btn--sm btn--full"
                onClick={() => setModal(f)}
              >
                + Add SIP / Lumpsum
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <AddInvestmentModal
          fund={modal}
          onClose={() => setModal(null)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}