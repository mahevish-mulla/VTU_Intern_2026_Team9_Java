import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/InvestorPortal.css";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Toast from "../components/Toast";
import ChatBot from "../components/ChatBot";        // ✅ NEW
import Dashboard from "../pages/Dashboard";
import BrowseFunds from "../pages/BrowseFunds";
import MyInvestments from "../pages/MyInvestments";
import Goals from "../pages/Goals";
import Profile from "../pages/Profile";
import ReturnsEstimator from "../pages/ReturnsEstimator";
import API from "../services/api";
import Notifications from "../pages/Notifications";

export default function InvestorPortal() {
  const [page, setPage] = useState("dashboard");
  const [prefillGoalAmount, setPrefillGoalAmount] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [funds, setFunds] = useState([]);
  const [goals, setGoals] = useState([]);
  const [toast, setToast] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Sync state with URL tab parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTabs = ["dashboard", "browse", "investments", "goals", "estimator", "profile", "notifications"];
    if (tab && validTabs.includes(tab)) {
      setPage(tab);
    }
  }, [location]);

  useEffect(() => {
    API.get("/api/investments/my")
      .then(res => setInvestments(res.data))
      .catch(err => console.error("Failed to load investments:", err));

    API.get("/api/goals")
      .then(res => setGoals(res.data))
      .catch(err => console.error("Failed to load goals:", err));
  }, []);

  useEffect(() => {
    API.get("/api/funds/browse")
      .then(res => {
        const mapped = res.data.map(f => ({
          id: f.fundId,
          name: f.fundName,
          house: f.amc?.amcName || "Unknown",
          category: f.category,
          risk: f.riskLevel,
          nav: Number(f.currentNav),
          schemeCode: f.schemeCode
        }));
        setFunds(mapped);
      })
      .catch(err => console.error("Failed to load funds:", err));
  }, []);

  const addInvestment = () => {
    API.get("/api/investments/my")
      .then(res => setInvestments(res.data))
      .catch(err => console.error("Failed to refresh investments:", err));
  };

  const deleteInvestment = (id) => {
    API.delete(`/api/investments/${id}/remove`)
      .then(() => {
        setInvestments(prev => prev.filter(i => i.id !== id));
        setToast("Investment removed");
      })
      .catch(err => console.error(err));
  };

  const addGoal = (g) => {
    API.post("/api/goals", g)
      .then(res => setGoals(x => [...x, res.data]))
      .catch(err => console.error("Failed to add goal:", err));
  };

  const deleteGoal = (id) => {
    API.delete(`/api/goals/${id}`)
      .then(() => setGoals(x => x.filter(g => g.id !== id)))
      .catch(err => console.error("Failed to delete goal:", err));
  };

  // ✅ ADD THIS NEW FUNCTION RIGHT HERE
  const fetchGoals = async () => {
    const res = await API.get("/api/goals");
    setGoals(res.data);  // replaces goals, doesn't append
  };

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
        onRefresh={addInvestment}
      />
    ),
    // AFTER:
    goals: <Goals goals={goals} onAdd={addGoal} onDelete={deleteGoal} onRefresh={fetchGoals} investments={investments} funds={funds} initialTargetAmount={prefillGoalAmount} onClearPrefill={() => setPrefillGoalAmount(null)} />,
    estimator: <ReturnsEstimator onNavigate={setPage} onSetGoalAmount={setPrefillGoalAmount} />,
    profile: <Profile />,
    notifications: <Notifications />,
  };

  return (
    <div className={`portal${sidebarCollapsed ? " portal--collapsed" : ""}`}>
      <Sidebar
        active={page}
        setActive={setPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      <div className="portal__main">
        <TopBar
          onNavigate={setPage}
        />
        <div className="portal__content">{pages[page]}</div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {/* ✅ ChatBot — appears on every page as floating button */}
      <ChatBot />
    </div>
  );
}