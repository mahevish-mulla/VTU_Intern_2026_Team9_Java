import { useState, useMemo } from "react";
import AddInvestmentModal from "../components/AddInvestmentModal";
import { CATEGORIES } from "../utils/data";
import { Ico } from "../utils/icons";

export default function BrowseFunds({
  funds,
  investments,
  onAddInvestment,
  showToast,
}) {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const [cat, setCat] = useState("All");
  const [modal, setModal] = useState(null);

  const ownedFundIds = new Set(investments.map((i) => i.fundId));

  const filtered = useMemo(() => {
    return funds.filter((f) => {
      const matchQ =
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.house.toLowerCase().includes(query.toLowerCase());
      const matchR =
        risk === "All" || f.risk.toUpperCase() === risk.toUpperCase();
      const matchC = cat === "All" || f.category === cat;
      return matchQ && matchR && matchC;
    });
  }, [funds, query, risk, cat]);

  function handleAdd(inv) {
    onAddInvestment(inv);
    showToast("Added to your portfolio!");
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
          <option value="MODERATE">Moderate Risk</option>
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

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__ico">◈</div>
          <p className="empty__title">No funds found</p>
          <p className="empty__sub">Try a different search or filter</p>
        </div>
      ) : (
        <div className="fund-grid">
          {filtered.map((f) => (
            <div className="fund-card" key={f.id}>
              <div className="fund-card__top">
                <div>
                  <div className="fund-card__name">{f.name}</div>
                  <div className="fund-card__house">{f.house}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
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
                <div>
                  <div className="fund-stat-lbl">1Y Return</div>
                  <div className="fund-stat-val fund-stat-val--g">
                    +{f.ret1y}%
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
      )}

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
