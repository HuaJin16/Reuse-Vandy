import { MdOutlineBookmarkAdded } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsHourglassSplit } from "react-icons/bs";

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getExpirationTime,
}) {
  return (
    <li>
      <span>
        <BsHourglassSplit />
        {getExpirationTime(notification.expirationDate)}
      </span>
      {notification.senderName} deleted the post "{notification.postInfo.title}"
      <img
        src={notification.postInfo.imageUrls[0]}
        alt={notification.postInfo.title}
      />
      <button onClick={() => onMarkAsRead(notification._id)}>
        <MdOutlineBookmarkAdded title="Mark as Read" />
      </button>
      <button onClick={() => onDelete(notification._id)}>
        <RiDeleteBinLine title="Delete notification" />
      </button>
    </li>
  );
}
