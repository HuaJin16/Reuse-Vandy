import { Link } from "react-router-dom";
import { MdOutlineBookmarkAdded } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsHourglassSplit } from "react-icons/bs";
import "../styles/NotificationItem.css";

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getExpirationTime,
}) {
  const renderNotificationContent = () => {
    switch (notification.notifType) {
      case "post_deleted":
        return (
          <div className="notification-deleted">
            <span className="notification-message">
              {notification.senderName} deleted the post "
              {notification.postInfo.title}"
            </span>
            <img
              src={notification.postInfo.imageUrls[0]}
              alt={notification.postInfo.title}
              className="notification-image"
            />
          </div>
        );
      case "new_message":
        return (
          <Link
            to={`/message/${notification.senderId}`}
            className="notification-new"
          >
            <span>{notification.senderName} sent you a message</span>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <li className="notification-item">
      <div className="expiration-time">
        <span>
          <BsHourglassSplit />
          {getExpirationTime(notification.expirationDate)}
        </span>
      </div>
      <div className="notification-content">
        <div className="notification-render">{renderNotificationContent()}</div>
        <div className="notification-buttons">
          <button
            onClick={() => onMarkAsRead(notification._id)}
            className="notification-read"
          >
            <MdOutlineBookmarkAdded title="Mark as Read" />
          </button>
          <button
            onClick={() => onDelete(notification._id)}
            className="notification-delete"
          >
            <RiDeleteBinLine title="Delete notification" />
          </button>
        </div>
      </div>
    </li>
  );
}
