import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NotificationItem from "../components/NotificationItem";
import "../styles/Notifications.css";

export default function Notification() {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [showReadNotifications, setShowReadNotifications] = useState(false);
  const [refereshNotifications, setRefreshNotifications] = useState(false);
  const [errors, setErrors] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  // fetch notifications for the current user on component mount
  useEffect(() => {
    setRefreshNotifications(false);
    const getNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/notification/get/${currentUser._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.notificationErrors) {
          setErrors(data.notificationErrors);
        } else {
          const unreadNotifiations = data.filter(
            (notif) => processNotifications(notif) && !notif.read
          );

          const readNotifications = data.filter(
            (notif) => processNotifications(notif) && notif.read
          );

          setUnreadNotifications(unreadNotifiations);
          setReadNotifications(readNotifications);
        }
      } catch (err) {
        setErrors({ general: "No notifications found" });
      }
    };
    getNotifications();
  }, [refereshNotifications]);

  // function that filters out notifications older than 30 days and sets expiration dates
  const processNotifications = (notif) => {
    const currentDate = new Date();
    const thirdyDaysAgo = new Date();
    thirdyDaysAgo.setDate(currentDate.getDate() - 30);

    const notificationDate = new Date(notif.createdAt);
    const expirationDate = new Date(notif.createdAt);
    expirationDate.setDate(notificationDate.getDate() + 30);
    notif.expirationDate = expirationDate;

    if (notificationDate < thirdyDaysAgo) {
      handleDeleteNotification(notif._id);
      return false;
    }
    return true;
  };

  // function to mark a notification as read and refresh the notifications list
  const handleNotificationAsRead = async (notificationId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/notification/update/${notificationId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.notificationErrors) {
        setErrors(data.notificationErrors);
      } else {
        setRefreshNotifications(true);
      }
    } catch (err) {
      setErrors({ general: "Error updating notification status" });
    }
  };

  // function to manage user-initiated and automatic notification deletions
  const handleDeleteNotification = async (notificationId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/notification/delete/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.notificationErrors) {
        setErrors(data.notificationErrors);
      } else {
        setRefreshNotifications(true);
      }
    } catch (err) {
      setErrors({ general: "Error deleting notification" });
    }
  };

  // function that calculates days until notification expires
  const getExpirationTime = (expirationDate) => {
    const currentDate = new Date();
    const difference = expirationDate.getTime() - currentDate.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return `${days} days `;
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2 className="notification-name">Notifications</h2>
        <p className="notification-note">
          Note: Notifications expire after 30 days
        </p>
      </div>
      {errors.notification || errors.general ? (
        <span>{errors.notification || errors.general}</span>
      ) : (
        <div className="notification-render">
          {unreadNotifications.length > 0 ? (
            <div className="notification-unread">
              <h3 className="notification-heading">Unread Notifications</h3>
              <ul className="notification-list">
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={handleNotificationAsRead}
                    onDelete={handleDeleteNotification}
                    getExpirationTime={getExpirationTime}
                    className="notification-item"
                  />
                ))}
              </ul>
            </div>
          ) : (
            "No unread notifications"
          )}
          {showReadNotifications && readNotifications.length > 0 ? (
            <div className="notification-read">
              <h3 className="notification-heading">Read Notifications</h3>
              <ul className="notification-list">
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={handleNotificationAsRead}
                    onDelete={handleDeleteNotification}
                    getExpirationTime={getExpirationTime}
                    className="notification-item"
                  />
                ))}
              </ul>
            </div>
          ) : showReadNotifications ? (
            "No read notifications"
          ) : (
            ""
          )}
        </div>
      )}
      <button
        onClick={() => setShowReadNotifications(!showReadNotifications)}
        className="notification-button"
      >
        {showReadNotifications
          ? "Hide Read Notifications"
          : "Show Read Notifications"}
      </button>
    </div>
  );
}
