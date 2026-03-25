import { useState, useEffect } from "react";

function AdminAddAmc() {
  const [amcName, setAmcName] = useState("");
  const [amcs, setAmcs] = useState([]);

  // Fetch AMC list
  const fetchAmcs = async () => {
    const res = await fetch("/api/amc");
    const data = await res.json();
    setAmcs(data);
  };

  useEffect(() => {
    fetchAmcs();
  }, []);

  // Submit AMC
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/amc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amc_name: amcName }),
    });

    setAmcName("");
    fetchAmcs(); // refresh list
  };

  return (
    <div>
      <h2>Add AMC</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter AMC name"
          value={amcName}
          onChange={(e) => setAmcName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <h3>All AMCs</h3>
      <ul>
        {amcs.map((amc, index) => (
          <li key={index}>{amc.amc_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminAddAmc;