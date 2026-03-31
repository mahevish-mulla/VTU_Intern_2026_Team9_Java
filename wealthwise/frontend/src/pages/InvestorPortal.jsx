import { useState, useEffect } from "react";
import "../styles/InvestorPortal.css";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import Dashboard from "../pages/Dashboard";
import BrowseFunds from "../pages/BrowseFunds";
import MyInvestments from "../pages/MyInvestments";
import Goals from "../pages/Goals";
import Profile from "../pages/Profile";

import API from "../services/api";
import { INITIAL_GOALS } from "../utils/data";

export default function InvestorPortal() {
  const [page, setPage] = useState("dashboard");
  const [investments, setInvestments] = useState([]);
  const [funds, setFunds] = useState([]);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [toast, setToast] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.error("User ID missing. Redirecting.");
      return;
    }

    API.get(`/api/investments/${userId}`)
      .then(res => setInvestments(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  useEffect(() => {
    API.get("/api/funds/browse")
      .then(res => {
        const mapped = res.data.map(f => ({
          id: f.fund_id,
          name: f.fundName,
          house: f.amc?.amcName || "Unknown",
          category: f.category,
          risk: f.riskLevel,
          nav: Number(f.currentNav),
          schemeCode: f.schemeCode
        }));
        setFunds(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  const addInvestment = (inv) => {
    setInvestments(prev => [...prev, inv]);
  };

  const deleteInvestment = (id) => {
    API.delete(`/api/investments/${id}`)
      .then(() => {
        setInvestments(prev => prev.filter(i => i.id !== id));
      })
      .catch(err => console.error(err));
  };

  const addGoal = (g) => setGoals((x) => [...x, g]);
  const deleteGoal = (id) => setGoals((x) => x.filter((g) => g.id !== id));

  const pages = {
    dashboard: <Dashboard investments={investments} funds={funds} />,
    browse: (
      <BrowseFunds
        investments={investments}
        showToast={setToast}
        onAddInvestment={addInvestment}
      />
    ),
    investments: (
      <MyInvestments
        investments={investments}
        funds={funds}
        onDelete={deleteInvestment}
      />
    ),
    goals: <Goals goals={goals} onAdd={addGoal} onDelete={deleteGoal} />,
    profile: <Profile />,
  };

  return (
    <div className="portal">
      <Sidebar active={page} setActive={setPage} />
      <div className="portal__content">{pages[page]}</div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}