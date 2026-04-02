import { useState } from "react";
import AddGoalModal from "../components/AddGoalModal";
import { Ico } from "../utils/icons";
import { fmtINR } from "../utils/helpers";

export default function Goals({ goals, onAdd, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page">
      <div className="page__head">
        <div className="page__head-row">
          <div>
            <h1 className="page__title">Goals</h1>
            <p className="page__sub">
              Define what you're investing towards and track your progress
            </p>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => setShowModal(true)}
          >
            <Ico.Plus /> New Goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="empty">
          <div className="empty__ico">🎯</div>
          <p className="empty__title">No goals yet</p>
          <p className="empty__sub">
            Add a goal to start tracking your progress
          </p>
        </div>
      ) : (
        <div className="goal-grid">
          {goals.map((g) => {
            const pct = Math.min((g.currentSaved / g.targetAmount) * 100, 100);
            const yearsLeft = Math.max(
              new Date(g.targetDate).getFullYear() - new Date().getFullYear(),
              0,
            );

            return (
              <div className="goal-card" key={g.id}>
                <div className="goal-card__top">
                  <span className="goal-card__emoji">{g.emoji}</span>
                  <button
                    className="goal-card__del"
                    onClick={() => onDelete(g.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>

                <div className="goal-card__name">{g.name}</div>
                <div className="goal-card__due">
                  Target · {g.targetDate} · {yearsLeft} yr
                  {yearsLeft !== 1 ? "s" : ""} left
                </div>

                <div className="goal-card__row">
                  <div>
                    <span className="goal-card__lbl">Saved</span>
                    <span className="goal-card__saved-val">
                      {fmtINR(g.currentSaved)}
                    </span>
                  </div>
                  <div>
                    <span
                      className="goal-card__lbl"
                      style={{ textAlign: "right", display: "block" }}
                    >
                      Target
                    </span>
                    <span className="goal-card__target-val">
                      {fmtINR(g.targetAmount)}
                    </span>
                  </div>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="goal-card__pct">{pct.toFixed(1)}% funded</div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddGoalModal
          onClose={() => setShowModal(false)}
          onAdd={(g) => {
            onAdd(g);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
