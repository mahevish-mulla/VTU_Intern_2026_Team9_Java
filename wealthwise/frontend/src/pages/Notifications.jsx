import { useState, useEffect } from "react";
import API from "../services/api";

export default function Notifications({ onRead }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get("/api/notifications");
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await API.put("/api/notifications/mark-read");
            fetchNotifications();
            onRead?.();
        } catch (err) {
            console.error(err);
        }
    };

    const markOneRead = async (id) => {
        try {
            await API.put(`/api/notifications/${id}/mark-read`);
            // Optimistically update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            onRead?.(); // refresh sidebar badge
        } catch (err) {
            console.error(err);
        }
    };

    const typeColor = (type) => {
        if (type === "FUND_DEACTIVATED") return "#f5a623";
        if (type === "SIP_STOPPED") return "#ff5252";
        if (type === "SIP_PAUSED") return "#f5a623";
        return "#5b8af5";
    };

    const typeIcon = (type) => {
        if (type === "FUND_DEACTIVATED") return "⚠️";
        if (type === "SIP_STOPPED") return "🔴";
        if (type === "SIP_PAUSED") return "⏸";
        return "🔔";
    };

    return (
        <div className="page">
            <div className="page__head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className="page__title">Notifications</h1>
                    <p className="page__sub">Stay updated on your investments</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button
                        className="btn btn--sm"
                        style={{ background: "#5b8af522", color: "#5b8af5", border: "1px solid #5b8af544" }}
                        onClick={markAllRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="empty"><p>Loading...</p></div>
            ) : notifications.length === 0 ? (
                <div className="empty">
                    <div className="empty__ico">🔔</div>
                    <p className="empty__title">No notifications</p>
                    <p className="empty__sub">You're all caught up!</p>
                </div>
            ) : (
                <div className="inv-list">
                    {notifications.map(n => (
                        <div key={n.id} style={{
                            background: n.read ? "var(--card)" : "var(--card-hover, #1e2433)",
                            border: `1px solid ${n.read ? "var(--border)" : typeColor(n.type) + "44"}`,
                            borderRadius: "12px",
                            padding: "16px 20px",
                            marginBottom: "12px",
                            display: "flex",
                            gap: "16px",
                            alignItems: "flex-start"
                        }}>
                            <div style={{ fontSize: "24px" }}>{typeIcon(n.type)}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontWeight: 600,
                                    color: typeColor(n.type),
                                    marginBottom: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    {n.title}
                                    {!n.read && (
                                        <span style={{
                                            background: "#ff5252",
                                            color: "white",
                                            fontSize: "10px",
                                            padding: "2px 6px",
                                            borderRadius: "999px"
                                        }}>NEW</span>
                                    )}
                                </div>
                                <div style={{ color: "var(--text-sub)", fontSize: "14px" }}>
                                    {n.message}
                                </div>
                                <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "6px" }}>
                                    {new Date(n.createdAt).toLocaleString()}
                                </div>
                            </div>
                            {!n.read && (
                                <button
                                    onClick={() => markOneRead(n.id)}
                                    style={{
                                        background: "transparent",
                                        border: `1px solid ${typeColor(n.type)}55`,
                                        color: typeColor(n.type),
                                        borderRadius: "8px",
                                        padding: "4px 12px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        alignSelf: "center",
                                        transition: "background 0.2s"
                                    }}
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}