import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MessagesList.css";

export default function MessagesList() {
  const [conversations, setConversations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:8000/message/messages", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.messageErrors) {
          setErrors(data.messageErrors);
        } else {
          setConversations(data);
        }
      } catch (err) {
        setErrors({ general: err.message });
      }
    };
    fetchConversations();
  }, []);

  const formatDate = (date) => {
    const currentDate = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(currentDate - messageDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return messageDate.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div className="messagesList-container">
      <h2 className="messagesList-title">Messages</h2>
      {(errors.general || errors.messages) && (
        <span className="messagesList-errors">
          {errors.general || errors.messages}
        </span>
      )}
      <ul className="conversations-list">
        {errors.messages ? (
          errors.messages
        ) : conversations.length === 0 ? (
          <span className="messages-none">No messages found</span>
        ) : (
          conversations.map((conv) => (
            <li key={conv.conversationId} className="conversation-item">
              <Link
                to={`/message/${conv.recipient._id}`}
                className="conversation-link"
              >
                <div className="conversation-avatar">
                  <img
                    src={conv.recipient.avatar}
                    alt="avatar"
                    className="conversation-avatar-image"
                  />
                </div>
                <div className="conversation-content">
                  <h3 className="conversation-name">
                    {conv.recipient.firstName} {conv.recipient.lastName}
                  </h3>
                  <p className="conversation-last-message">
                    {conv.lastMessage.senderId === conv.recipient._id
                      ? conv.lastMessage.message
                      : `You: ${conv.lastMessage.message}`}
                  </p>
                  <p className="conversation-time">
                    {formatDate(conv.lastMessage.updatedAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
