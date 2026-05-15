import { useState, useEffect } from "react";
import AddGoalModal from "../components/AddGoalModal";
import { Ico } from "../utils/icons";
import { fmtINR, getInvested, getCurrentVal } from "../utils/helpers";
import API from "../services/api";
import "../styles/goals.css";

export default function Goals({ goals, onAdd, onDelete, onRefresh, investments = [], funds = [], initialTargetAmount, onClearPrefill }) {
  const [showModal, setShowModal] = useState(!!initialTargetAmount);

  useEffect(() => {
    if (initialTargetAmount) {
      setShowModal(true);
    }
  }, [initialTargetAmount]);
  const [linkModal, setLinkModal] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState("");

  const uniqueInvestments = investments.filter(
    (inv, idx, self) => self.findIndex(i => i.id === inv.id) === idx
  );

  const handleLinkInvestment = async (goalId, investmentId) => {
    setLinkLoading(true);
    setLinkError("");
    try {
      await API.post(`/api/goals/${goalId}/link-investment`, { investmentId });
      onRefresh();
      setLinkModal(null);
    } catch (err) {
      setLinkError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to link investment"
      );
    } finally {
      setLinkLoading(false);
    }
  };

  /**
   * Compute the total current value from all linked investments for a goal.
   * Uses units × NAV (real market value) instead of static amount.
   */
  const getLinkedValue = (goal) => {
    if (!goal.linkedInvestmentIds?.length) return 0;
    return goal.linkedInvestmentIds.reduce((sum, invId) => {
      const inv = investments.find(i => i.id === invId);
      if (!inv) return sum;
      const currentVal = getCurrentVal(inv, funds);
      // If we can compute market value (has units + fund NAV), use that.
      // Otherwise fall back to totalInvested or amount.
      if (currentVal > 0) return sum + currentVal;
      return sum + getInvested(inv);
    }, 0);
  };

  return (
    <div className="page">

      <div className="page__head">
        <div className="page__head-row">
          <div>
            <h1 className="page__title">Wealth <em>Goals</em></h1>
            <p className="page__sub" style={{ marginTop: "6px" }}>
              Define your targets, link investments, and track your path to financial freedom
            </p>
          </div>
          <button className="btn btn--primary" onClick={() => setShowModal(true)}>
            <Ico.Plus /> New Goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="empty">
          <div className="empty__ico">🎯</div>
          <p className="empty__title">No goals yet</p>
          <p className="empty__sub">Add a goal to start tracking your progress</p>
        </div>
      ) : (
        <div className="goal-grid">
          {goals.map((g) => {
            // Compute linked investments' current market value
            const linkedValue = getLinkedValue(g);
            // Total progress = manually saved + linked investment value
            const totalSaved = Number(g.currentSaved || 0) + linkedValue;
            const pct = Math.min(
              (totalSaved / Number(g.targetAmount)) * 100,
              100
            );
            const yearsLeft = Math.max(
              new Date(g.targetDate).getFullYear() - new Date().getFullYear(),
              0
            );

            const linkedInv =
              g.linkedInvestmentIds?.length > 0
                ? investments.find(i => i.id === g.linkedInvestmentIds[0])
                : null;

            const hasLinked = !!linkedInv;

            // Linked investment details
            let linkedCurrentVal = 0;
            let linkedInvested = 0;
            let linkedGain = 0;
            let linkedGainPct = 0;
            if (hasLinked) {
              linkedCurrentVal = getCurrentVal(linkedInv, funds);
              linkedInvested = getInvested(linkedInv);
              // If market value is available use it, else fall back
              if (linkedCurrentVal <= 0) linkedCurrentVal = linkedInvested;
              linkedGain = linkedCurrentVal - linkedInvested;
              linkedGainPct = linkedInvested > 0 ? (linkedGain / linkedInvested) * 100 : 0;
            }

            return (
              <div className="goal-card" key={g.id}>

                <div className="goal-card__top">
                  <span className="goal-card__emoji">{g.emoji}</span>
                  <button
                    className="goal-card__del"
                    onClick={() => onDelete(g.id)}
                    title="Delete goal"
                  >
                    ✕
                  </button>
                </div>

                <div className="goal-card__name">{g.name}</div>
                <div className="goal-card__due">
                  TARGET · {g.targetDate} · {yearsLeft} YR{yearsLeft !== 1 ? "S" : ""} LEFT
                </div>

                <div className="goal-card__row">
                  <div>
                    <span className="goal-card__lbl">Progress</span>
                    <span className="goal-card__saved-val">{fmtINR(totalSaved)}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="goal-card__lbl">Target</span>
                    <span className="goal-card__target-val">{fmtINR(g.targetAmount)}</span>
                  </div>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="goal-card__pct">{pct.toFixed(1)}% funded</div>

                {/* Linked Investment */}
                <div className="goal-linked">
                  <div className="goal-linked__label">Linked Investment</div>

                  {hasLinked ? (
                    <div className="goal-linked__detail">
                      <div className="goal-linked__item">
                        <div className="goal-linked__dot" />
                        <div className="goal-linked__name">
                          {linkedInv?.mutualFund?.fundName || "Investment"}
                        </div>
                      </div>
                      <div className="goal-linked__stats">
                        <div className="goal-linked__stat">
                          <span className="goal-linked__stat-lbl">Invested</span>
                          <span className="goal-linked__stat-val">{fmtINR(linkedInvested)}</span>
                        </div>
                        <div className="goal-linked__stat">
                          <span className="goal-linked__stat-lbl">Current Value</span>
                          <span className="goal-linked__stat-val">{fmtINR(linkedCurrentVal)}</span>
                        </div>
                        <div className="goal-linked__stat">
                          <span className="goal-linked__stat-lbl">Growth</span>
                          <span className={`goal-linked__stat-val ${linkedGain >= 0 ? "goal-linked__stat-val--up" : "goal-linked__stat-val--down"}`}>
                            {linkedGain >= 0 ? "+" : ""}{fmtINR(Math.abs(linkedGain))}
                            <small> ({linkedGain >= 0 ? "+" : ""}{linkedGainPct.toFixed(2)}%)</small>
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="goal-linked__empty">No investment linked</div>
                  )}

                  <button
                    className={`goal-linked__btn ${hasLinked ? "goal-linked__btn--change" : ""}`}
                    onClick={() => { setLinkError(""); setLinkModal(g.id); }}
                  >
                    {hasLinked ? "⇄ Change Investment" : "+ Link Investment"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showModal && (
        <AddGoalModal
          initialTargetAmount={initialTargetAmount}
          onClose={() => {
            setShowModal(false);
            if (onClearPrefill) onClearPrefill();
          }}
          onAdd={(g) => { 
            onAdd(g); 
            setShowModal(false); 
            if (onClearPrefill) onClearPrefill();
          }}
        />
      )}

      {/* Link Investment Modal */}
      {linkModal !== null && (
        <div
          className="modal-bg"
          onClick={(e) => e.target === e.currentTarget && setLinkModal(null)}
        >
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal__hd">
              <span className="modal__title">Link Investment to Goal</span>
              <button className="modal__close" onClick={() => setLinkModal(null)}>✕</button>
            </div>

            {/* ✅ uses global modal__sub instead of custom link-modal__sub */}
            <p className="modal__sub">
              Select one investment fund to link. You can change it later.
            </p>

            {linkError && <div className="form-error">{linkError}</div>}

            <div className="link-modal__list">
              {uniqueInvestments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-dim)", fontSize: 13 }}>
                  No investments available
                </div>
              ) : (
                uniqueInvestments.map((inv) => {
                  const currentGoal = goals.find(g => g.id === linkModal);
                  const isCurrent = currentGoal?.linkedInvestmentIds?.includes(inv.id);
                  const otherGoal = goals.find(
                    g => g.id !== linkModal && g.linkedInvestmentIds?.includes(inv.id)
                  );

                  return (
                    <button
                      key={inv.id}
                      className={`inv-option ${isCurrent ? "inv-option--current" : ""}`}
                      onClick={() => !isCurrent && handleLinkInvestment(linkModal, inv.id)}
                      disabled={linkLoading || isCurrent}
                      title={isCurrent ? "Already linked to this goal" : ""}
                    >
                      <div className="inv-option__icon">
                        {inv.type === "SIP" ? "🔄" : "💼"}
                      </div>

                      <div className="inv-option__body">
                        <div className="inv-option__name">
                          {inv.mutualFund?.fundName || "Investment"}
                        </div>
                        <div className="inv-option__meta">
                          {inv.type} · {fmtINR(inv.amount)}
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="inv-option__badge">Current</span>
                      )}
                      {otherGoal && !isCurrent && (
                        <span className="inv-option__other-goal">
                          Used by {otherGoal.name}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
