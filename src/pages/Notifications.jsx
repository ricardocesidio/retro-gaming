import { useEffect, useMemo, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Notifications.css";
import {
  markAllNotificationsRead,
  markNotificationRead,
  readNotifications,
} from "../utils/uiState";

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(() => readNotifications());

  useEffect(() => {
    const sync = () => setNotifications(readNotifications());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const filteredNotifications = useMemo(
    () => notifications.filter((n) => (filter === "all" ? true : n.unread)),
    [notifications, filter]
  );

  const handleMarkAsRead = (id) => {
    setNotifications(markNotificationRead(id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(markAllNotificationsRead());
  };

  return (
    <main className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <button type="button" onClick={handleMarkAllAsRead} className="mark-all-read-btn">
          Mark all as read
        </button>
      </div>

      <div className="filter-bar">
        <button
          type="button"
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={`filter-btn ${filter === "unread" ? "active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.map((notif) => (
          <button
            key={notif.id}
            type="button"
            className={`notification-item ${notif.unread ? "unread" : ""}`}
            onClick={() => handleMarkAsRead(notif.id)}
          >
            <i className={`fa-solid ${notif.icon}`} style={{ color: notif.color }} />
            <div className="notification-content">
              <p className="notification-message">{notif.message}</p>
              <span className="notification-time">{notif.time}</span>
            </div>
            {notif.unread && <div className="unread-indicator" />}
          </button>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="no-notifications">
            <p>No notifications to show.</p>
          </div>
        )}
      </div>
    </main>
  );
}
