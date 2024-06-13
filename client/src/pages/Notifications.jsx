import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TiDeleteOutline } from "react-icons/ti";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
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
          const unreadNotifiations = data.filter((notif) => !notif.read);
          const readNotifications = data.filter((notif) => notif.read);
          setNotifications(unreadNotifiations);
          setReadNotifications(readNotifications);
        }
      } catch (err) {
        setErrors({ general: "Error fetching notifications" });
      }
    };
    getNotifications();
  }, [refereshNotifications]);

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

  return (
    <div>
      <h2>Notifications</h2>
      {errors.notification || errors.general ? (
        <span>{errors.notification || errors.general}</span>
      ) : (
        <div>
          {notifications.length > 0 && (
            <div>
              <h3>Unread Notifications</h3>
              {notifications.map((notification) => (
                <ul key={notification._id}>
                  <li>
                    <TiDeleteOutline />
                    {notification.senderName} deleted the post "
                    {notification.postInfo.title}"
                    <img
                      src={notification.postInfo.imageUrls[0]}
                      alt={notification.postInfo.title}
                    />
                    <button
                      onClick={() => handleNotificationAsRead(notification._id)}
                    >
                      Mark as Read
                    </button>
                  </li>
                </ul>
              ))}
            </div>
          )}
          {showReadNotifications && readNotifications.length > 0 && (
            <div>
              <h3>Read Notifications</h3>
              {readNotifications.map((notification) => (
                <ul key={notification._id}>
                  <li>
                    <TiDeleteOutline />
                    {notification.senderName} deleted the post "
                    {notification.postInfo.title}"
                    <img
                      src={notification.postInfo.imageUrls[0]}
                      alt={notification.postInfo.title}
                    />
                  </li>
                </ul>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={() => setShowReadNotifications(!showReadNotifications)}>
        {showReadNotifications
          ? "Hide Read Notifications"
          : "Show Read Notifications"}
      </button>
    </div>
  );
}
