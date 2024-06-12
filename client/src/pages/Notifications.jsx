import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TiDeleteOutline } from "react-icons/ti";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // fetch notifications for the current user on component mount
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/notification/get/${currentUser._id}`
        );
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setNotifications(data);
        }
      } catch (err) {
        setError("Error fetching notifications");
      }
    };
    getNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <div>
        {error ? (
          <span>{error}</span>
        ) : (
          notifications.length > 0 &&
          notifications.map((notification) => (
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
          ))
        )}
      </div>
    </div>
  );
}
