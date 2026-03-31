import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [schemeCode, setSchemeCode] = useState("");
  const [risk, setRisk] = useState("HIGH");

  const [amcName, setAmcName] = useState("");
  const [amcs, setAmcs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchAmcs();
  }, []);

  const fetchAmcs = () => {
    API.get("/api/admin/amcs")
      .then(res => setAmcs(res.data))
      .catch(err => console.error(err));
  };

  const handleAddAmc = () => {
    if (!amcName.trim()) {
      setMessage("Enter AMC name");
      return;
    }

    setLoading(true);
    setMessage("");

    API.post("/api/admin/amc", {
      amcName: amcName
    })
      .then(() => {
        setMessage("AMC added successfully");
        setAmcName("");
        fetchAmcs();
      })
      .catch(() => {
        setMessage("Failed to add AMC");
      })
      .finally(() => setLoading(false));
  };

  const handleAddFund = () => {
    if (!schemeCode) {
      setMessage("Enter scheme code");
      return;
    }

    setLoading(true);
    setMessage("");

    API.post(`/api/admin/funds/auto/${schemeCode}?risk=${risk}`)
      .then(() => {
        setMessage("Fund added successfully");
        setSchemeCode("");
      })
      .catch(() => {
        setMessage("Failed to add fund");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="admin">
      <h1 className="admin__title">Admin Dashboard</h1>

      <div className="admin__grid">

        <div className="admin__card">
          <div className="admin__card-title">Add AMC</div>

          <input
            className="admin__input"
            placeholder="Enter AMC name"
            value={amcName}
            onChange={(e) => setAmcName(e.target.value)}
          />

          <button
            className="admin__btn"
            onClick={handleAddAmc}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add AMC"}
          </button>

          <ul className="admin__list">
            {amcs.length === 0 ? (
              <li>No AMCs found</li>
            ) : (
              amcs.map(a => (
                <li key={a.amcId}>{a.amcName}</li>
              ))
            )}
          </ul>
        </div>

        <div className="admin__card">
          <div className="admin__card-title">Add Fund (Auto via mfAPI)</div>

          <input
            className="admin__input"
            placeholder="Scheme Code"
            value={schemeCode}
            onChange={(e) => setSchemeCode(e.target.value)}
          />

          <select
            className="admin__select"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <button
            className="admin__btn"
            onClick={handleAddFund}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Fund"}
          </button>

          {message && <div className="admin__msg">{message}</div>}
        </div>

      </div>

      <button className="admin__logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}