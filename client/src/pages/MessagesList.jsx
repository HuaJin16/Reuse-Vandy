import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div>
      <h2>Messages</h2>
      {errors.general && <span>{errors.general}</span>}
      <ul>
        {errors.messages
          ? errors.messages
          : conversations.map((conv) => (
              <li key={conv.conversationId}>
                <Link to={`/message/${conv.recipient._id}`}>
                  <img src={conv.avatar} alt={conv.recipient.firstName} />
                  <span>
                    {conv.recipient.firstName} {conv.recipient.lastName}
                  </span>
                  <p>
                    {conv.lastMessage.senderId === conv.recipient._id
                      ? conv.lastMessage.message
                      : `You: ${conv.lastMessage.message}`}
                  </p>
                  <p>{formatDate(conv.lastMessage.updatedAt)}</p>
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
}
