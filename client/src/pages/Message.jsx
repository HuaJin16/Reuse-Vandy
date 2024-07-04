import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [receiver, setReceiver] = useState(null);
  const [socket, setSocket] = useState(null);
  const { recipientId } = useParams();

  useEffect(() => {
    const getMessages = async () => {
      try {
        // fetch existing messages
        const messagesRes = await fetch(
          `http://localhost:8000/message/get/${recipientId}`,
          { credentials: "include" }
        );
        const messagesData = await messagesRes.json();
        if (messagesData.messageErrors) {
          setErrors(messagesData.messageErrors);
        } else {
          setMessages(messagesData);
        }

        // fetch receiver information
        const receiverRes = await fetch(
          `http://localhost:8000/user/${recipientId}`,
          { credentials: "include" }
        );
        const receiverData = await receiverRes.json();
        if (receiverData.messageErrors) {
          setErrors(receiverData.messageErrors);
        } else {
          setReceiver(receiverData);
        }

        // establish WebSocket connection
        const newSocket = io("http://localhost:8000");
        setSocket(newSocket);

        // listen for incoming messages
        newSocket.on("new_message", (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });

        // WebSocket cleanup
        return () => newSocket.close();
      } catch (err) {
        setErrors({ general: err.message });
      }
    };
    getMessages();
  }, []);

  // function that handles sending a message from the current user to a recipient
  const sendMessage = async (e) => {
    console.log("Send button clicked");
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/message/send/${recipientId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );
      const data = await res.json();
      if (data.messageErrors) {
        setErrors(data.messageErrors);
      } else {
        // emit the new message to the backend
        socket.emit("send_message", data);
        setNewMessage("");
      }
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div>
      {errors.general && <span>Error: {errors.general}</span>}
      {receiver && (
        <div>
          <img src={receiver.avatar} />
          <span>
            {receiver.firstName} {receiver.lastName}
          </span>
        </div>
      )}
      <div>
        {errors.messages
          ? errors.messages
          : messages.map((msg, index) => (
              <div key={`${msg._id}-${index}`}>{msg.message}</div>
            ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message"
        />
        <button type="submit" title="Send">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}
