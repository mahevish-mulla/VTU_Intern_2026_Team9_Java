import { useState, useEffect, useRef } from "react";
import { Ico } from "../utils/icons";
import { getUserProfile } from "../services/authService";
import API from "../services/api";

export default function TopBar({ onNavigate }) {
  const [userName, setUserName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile(token)
        .then((data) => setUserName(data.name || "User"))
        .catch(() => setUserName("User"));
    }
  }, []);

  // Fetch unread count
  const fetchUnread = async () => {
    try {
      const res = await API.get("/api/notifications/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when dropdown opens
  const toggleNotifications = async () => {
    if (!showNotif) {
      try {
        const res = await API.get("/api/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    setShowNotif(!showNotif);
  };

  const markOneRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/mark-read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      fetchUnread();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/api/notifications/mark-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      fetchUnread();
    } catch (err) {
      console.error(err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const initials = userName
    ? userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="topbar">
      {/* Center spacer */}
      <div className="topbar__spacer" />

      {/* Right side actions */}
      <div className="topbar__actions">
        {/* Notification bell */}
        <div className="topbar__notif-wrap" ref={dropdownRef}>
          <button
            className="topbar__icon-btn"
            onClick={toggleNotifications}
            title="Notifications"
          >
            <Ico.Bell />
            {unreadCount > 0 && (
              <span className="topbar__notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="topbar__notif-dropdown">
              <div className="topbar__notif-header">
                <span className="topbar__notif-title">Notifications</span>
                {notifications.some((n) => !n.read) && (
                  <button className="topbar__notif-mark-all" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="topbar__notif-list">
                {notifications.length === 0 ? (
                  <div className="topbar__notif-empty">
                    <span>🔔</span>
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      className={`topbar__notif-item${!n.read ? " topbar__notif-item--unread" : ""}`}
                      onClick={() => !n.read && markOneRead(n.id)}
                    >
                      <div className="topbar__notif-icon">{typeIcon(n.type)}</div>
                      <div className="topbar__notif-body">
                        <div className="topbar__notif-item-title" style={{ color: typeColor(n.type) }}>
                          {n.title}
                          {!n.read && <span className="topbar__notif-new">NEW</span>}
                        </div>
                        <div className="topbar__notif-msg">{n.message}</div>
                        <div className="topbar__notif-time">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <button
                  className="topbar__notif-viewall"
                  onClick={() => {
                    onNavigate?.("notifications");
                    setShowNotif(false);
                  }}
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>


        {/* User avatar + name */}
        <button
          className="topbar__user"
          onClick={() => onNavigate?.("profile")}
          title="View profile"
        >
          <div className="topbar__avatar">{initials}</div>
          <span className="topbar__username">{userName}</span>
        </button>
      </div>
    </div>
  );
}
