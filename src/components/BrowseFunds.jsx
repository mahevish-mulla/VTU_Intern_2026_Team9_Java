import { useState } from "react";

function BrowseFunds() {
  const [funds] = useState([
    {
      fundName: "SBI Equity Fund",
      amc: "SBI",
      category: "Equity",
      risk: "High",
      nav: 120,
    },
    {
      fundName: "HDFC Debt Fund",
      amc: "HDFC",
      category: "Debt",
      risk: "Low",
      nav: 95,
    },
  ]);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  // Filter logic
  const filteredFunds = funds.filter((fund) => {
    return (
      (categoryFilter === "" || fund.category === categoryFilter) &&
      (riskFilter === "" || fund.risk === riskFilter)
    );
  });

  return (
    <div>
      <h2>Browse Funds</h2>

      {/* Filters */}
      <select onChange={(e) => setCategoryFilter(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Equity">Equity</option>
        <option value="Debt">Debt</option>
      </select>

      <select onChange={(e) => setRiskFilter(e.target.value)}>
        <option value="">All Risk</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <hr />

      {/* Fund Cards */}
      {filteredFunds.map((fund, index) => (
        <div
          key={index}
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
          }}
        >
          <h3>{fund.fundName}</h3>
          <p>AMC: {fund.amc}</p>
          <p>Category: {fund.category}</p>
          <p>Risk: {fund.risk}</p>
          <p>NAV: ₹{fund.nav}</p>

          <button>Invest Now</button>
        </div>
      ))}
    </div>
  );
}

export default BrowseFunds;