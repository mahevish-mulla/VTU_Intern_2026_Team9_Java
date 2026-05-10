import { useState } from "react";
import { ADMIN_API } from "../services/api";

export default function AdminAlerts({ showToast }) {
  const [loading, setLoading] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const sendSipDueAlert = async () => {
    setLoading("sip");
    try {
      const res = await ADMIN_API.post(`/api/admin/alerts/sip-due`);
      const count = res.data.count || 0;
      if (count > 0) {
        showToast(`Sent ${count} SIP reminder(s) successfully!`);
      } else {
        showToast("No SIPs due in the next 3 days. 0 reminders sent.");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to send SIP reminders");
    } finally {
      setLoading(null);
    }
  };

  const sendCustomAlert = async (e) => {
    e.preventDefault();
    if (!messageTitle || !messageBody) {
      showToast("Please enter title and message.");
      return;
    }
    setLoading("custom");
    try {
      await ADMIN_API.post(`/api/admin/alerts/custom`, {
        title: messageTitle,
        body: messageBody
      });
      showToast("Broadcast sent to all investors!");
      setMessageTitle("");
      setMessageBody("");
    } catch (err) {
      console.error(err);
      showToast("Failed to send broadcast");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: "32px", width: "100%", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, margin: 0 }}>
          Send Alerts
        </h1>
        <p style={{ color: "#aaa", marginTop: "6px", fontSize: "14px" }}>
          Notify investors about SIPs and important updates
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

        {/* Quick Actions */}
        <div style={{
          background: "#161b27",
          border: "1px solid #2a2f3f",
          borderRadius: "16px",
          padding: "28px"
        }}>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 600, margin: "0 0 6px 0" }}>
            Quick Actions
          </h2>
          <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 24px 0" }}>
            Send automated system reminders.
          </p>

          {/* SIP Due Reminder */}
          <div style={{
            background: "#1e2535",
            border: "1px solid #2a2f3f",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "18px" }}>⏰</span>
                <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, margin: 0 }}>
                  SIP Due Reminder
                </h3>
              </div>
              <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>
                Send reminder to investors whose SIP is due in the next 3 days.
              </p>
            </div>
            <button
              onClick={sendSipDueAlert}
              disabled={loading === "sip"}
              style={{
                background: "#f5a623",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: loading === "sip" ? 0.7 : 1
              }}
            >
              {loading === "sip" ? "Sending..." : "Send Now →"}
            </button>
          </div>
        </div>

        {/* Custom Message */}
        <div style={{
          background: "#161b27",
          border: "1px solid #2a2f3f",
          borderRadius: "16px",
          padding: "28px"
        }}>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 600, margin: "0 0 6px 0" }}>
            Custom Broadcast
          </h2>
          <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 24px 0" }}>
            Send a custom notification to all investors.
          </p>

          <form onSubmit={sendCustomAlert} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ color: "#aaa", fontSize: "12px", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
                MESSAGE TITLE
              </label>
              <input
                placeholder="e.g. Important Update: Maintenance Window"
                value={messageTitle}
                onChange={e => setMessageTitle(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1e2535",
                  border: "1px solid #2a2f3f",
                  color: "#fff",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ color: "#aaa", fontSize: "12px", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
                MESSAGE BODY
              </label>
              <textarea
                placeholder="Write your custom alert message here..."
                rows="5"
                value={messageBody}
                onChange={e => setMessageBody(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1e2535",
                  border: "1px solid #2a2f3f",
                  color: "#fff",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading === "custom"}
              style={{
                background: "#f5a623",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "13px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                opacity: loading === "custom" ? 0.7 : 1
              }}
            >
              {loading === "custom" ? "Sending..." : "Broadcast Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}