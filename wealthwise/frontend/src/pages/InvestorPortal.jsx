import { useState } from "react";
import "../styles/InvestorPortal.css";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import Dashboard from "../pages/Dashboard";
import BrowseFunds from "../pages/BrowseFunds";
import MyInvestments from "../pages/MyInvestments";
import Goals from "../pages/Goals";
import Profile from "../pages/Profile";

import { FUNDS, INITIAL_INVESTMENTS, INITIAL_GOALS } from "../utils/data";

export default function InvestorPortal() {
  const [page, setPage] = useState("dashboard");
  const [investments, setInvestments] = useState(INITIAL_INVESTMENTS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [toast, setToast] = useState(null);

  const addInvestment = (inv) => setInvestments((x) => [...x, inv]);
  const deleteInvestment = (id) =>
    setInvestments((x) => x.filter((i) => i.id !== id));
  const addGoal = (g) => setGoals((x) => [...x, g]);
  const deleteGoal = (id) => setGoals((x) => x.filter((g) => g.id !== id));

  const pages = {
    dashboard: <Dashboard investments={investments} funds={FUNDS} />,
    browse: (
      <BrowseFunds
        investments={investments}
        funds={FUNDS}
        onAddInvestment={addInvestment}
        showToast={setToast}
      />
    ),
    investments: (
      <MyInvestments
        investments={investments}
        funds={FUNDS}
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
