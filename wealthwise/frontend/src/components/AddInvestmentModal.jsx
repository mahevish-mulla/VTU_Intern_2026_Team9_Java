import { useState } from "react";
import { fmtFull } from "../utils/helpers";

export default function AddInvestmentModal({ fund, onClose, onAdd }) {
  const [tab, setTab] = useState("sip");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const units = amount
    ? parseFloat((parseFloat(amount) / fund.nav).toFixed(4))
    : 0;

  function submit() {
    const amt = parseFloat(amount.trim());

    if (isNaN(amt) || amt <= 0) {
      alert("Enter valid amount");
      return;
    }

    onAdd({
      fundId: fund.id,
      amount: amt,
      type: tab === "sip" ? "SIP" : "LUMP_SUM"
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
          <span className="modal__title">Add Investment</span>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="modal__sub">
          {fund.name} · NAV {fmtFull(fund.nav)}
        </p>

        <div className="modal__tabs">
          {["sip", "lumpsum"].map((t) => (
            <button
              key={t}
              className={`modal__tab${tab === t ? " modal__tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "sip" ? "SIP" : "Lumpsum"}
            </button>
          ))}
        </div>

        <div className="form-grp">
          <label className="form-lbl">
            {tab === "sip" ? "Monthly Amount (₹)" : "Amount (₹)"}
          </label>
          <input
            className="form-inp"
            type="number"
            min="1"
            placeholder={`Min ₹${tab === "sip" ? 500 : 1000}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-grp">
          <label className="form-lbl">
            {tab === "sip" ? "SIP Start Date" : "Investment Date"}
          </label>
          <input
            className="form-inp"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {amount > 0 && (
          <div className="modal__preview">
            {tab === "sip"
              ? `First instalment: ${fmtFull(parseFloat(amount))} → ${units} units @ ₹${fund.nav}`
              : `${fmtFull(parseFloat(amount))} → ${units} units @ ₹${fund.nav}`}
          </div>
        )}

        <div className="modal__footer">
          <button className="btn btn--primary btn--full" onClick={submit}>
            Add Investment
          </button>
        </div>
      </div>
    </div>
  );
}