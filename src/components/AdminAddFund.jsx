import { useState } from "react";

function AdminAddFund() {
  const [fundName, setFundName] = useState("");
  const [category, setCategory] = useState("");
  const [risk, setRisk] = useState("");
  const [amc, setAmc] = useState("");
  const [schemeCode, setSchemeCode] = useState("");

  const [funds, setFunds] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFund = {
      fundName,
      category,
      risk,
      amc,
      schemeCode,
    };

    setFunds([...funds, newFund]);

    // clear form
    setFundName("");
    setCategory("");
    setRisk("");
    setAmc("");
    setSchemeCode("");
  };

  return (
    <div>
      <h2>Add Fund</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Fund Name"
          value={fundName}
          onChange={(e) => setFundName(e.target.value)}
        />

        <br /><br />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Equity">Equity</option>
          <option value="Debt">Debt</option>
        </select>

        <br /><br />

        <select value={risk} onChange={(e) => setRisk(e.target.value)}>
          <option value="">Select Risk</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="AMC Name"
          value={amc}
          onChange={(e) => setAmc(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Scheme Code"
          value={schemeCode}
          onChange={(e) => setSchemeCode(e.target.value)}
        />

        <br /><br />

        <button type="submit">Add Fund</button>
      </form>

      <h3>Funds List</h3>
      <ul>
        {funds.map((fund, index) => (
          <li key={index}>
            {fund.fundName} - {fund.category} - {fund.risk}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminAddFund;