import { useState } from "react";
import { GOAL_EMOJIS } from "../utils/data";

export default function AddGoalModal({ onClose, onAdd }) {
  const [f, setF] = useState({
    name: "",
    category: "home",
    targetAmount: "",
    targetDate: "",
    currentSaved: "",
    description: "",
  });

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  function submit() {
    if (!f.name || !f.targetAmount || !f.targetDate) return;
    onAdd({
      id: Date.now(),
      name: f.name,
      category: f.category,
      emoji: GOAL_EMOJIS[f.category] || "⭐",
      targetAmount: parseFloat(f.targetAmount),
      targetDate: f.targetDate,
      currentSaved: parseFloat(f.currentSaved) || 0,
      description: f.description,
    });
    onClose();
  }

  return (
    <div
      className="modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal__hd">
          <span className="modal__title">New Goal</span>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-grp">
          <label className="form-lbl">Goal Name</label>
          <input
            className="form-inp"
            placeholder="e.g. Own a home in Bangalore"
            value={f.name}
            onChange={set("name")}
          />
        </div>

        <div className="form-grp">
          <label className="form-lbl">Category</label>
          <select
            className="form-sel"
            value={f.category}
            onChange={set("category")}
          >
            <option value="home">🏠 Home</option>
            <option value="retirement">🌴 Retirement</option>
            <option value="education">📚 Education</option>
            <option value="car">🚗 Car</option>
            <option value="travel">✈️ Travel / Vacation</option>
            <option value="emergency">🛡️ Emergency Fund</option>
            <option value="other">⭐ Other</option>
          </select>
        </div>

        <div className="form-grp">
          <label className="form-lbl">Target Amount (₹)</label>
          <input
            className="form-inp"
            type="number"
            placeholder="e.g. 5000000"
            value={f.targetAmount}
            onChange={set("targetAmount")}
          />
        </div>

        <div className="form-grp">
          <label className="form-lbl">Target Date</label>
          <input
            className="form-inp"
            type="date"
            value={f.targetDate}
            onChange={set("targetDate")}
          />
        </div>

        <div className="form-grp">
          <label className="form-lbl">Already Saved (₹) — Optional</label>
          <input
            className="form-inp"
            type="number"
            placeholder="0"
            value={f.currentSaved}
            onChange={set("currentSaved")}
          />
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary btn--full" onClick={submit}>
            Create Goal →
          </button>
        </div>
      </div>
    </div>
  );
}
