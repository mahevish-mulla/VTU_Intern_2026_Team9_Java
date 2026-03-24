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
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    const nextSIP = (() => {
      const d = new Date(date);
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().split("T")[0];
    })();

    if (tab === "sip") {
      onAdd({
        id: Date.now(),
        fundId: fund.id,
        type: "sip",
        monthlyAmount: amt,
        instalments: 1,
        totalInvested: amt,
        avgNAV: fund.nav,
        units,
        startDate: date,
        nextSIP,
      });
    } else {
      onAdd({
        id: Date.now(),
        fundId: fund.id,
        type: "lumpsum",
        amount: amt,
        buyNAV: fund.nav,
        units,
        date,
      });
    }
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
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary btn--full" onClick={submit}>
            Add to Portfolio →
          </button>
        </div>
      </div>
    </div>
  );
}
