import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { MdOutlineBookmarkAdd, MdOutlineNotifications } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "../styles/Header.css";

export default function Header() {
  const { currentUser, savedPosts } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [savedPostCount, setSavedPostCount] = useState(0);
  const navigate = useNavigate();

  // function to update URL with search term and navigate to search results page
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // synchronizes search term state with URL query string
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  }, [window.location.search]);

  // update the number of unread notifications and saved posts
  useEffect(() => {
    const getInitialData = async () => {
      try {
        // fetch initial unread notifications count
        const res = await fetch(
          `http://localhost:8000/notification/get/${currentUser._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!data.notificationErrors) {
          const unreadNotifications = data.filter((notif) => !notif.read);
          setUnreadNotifCount(unreadNotifications.length);
        }
        // retrieve intial saved posts count
        setSavedPostCount(savedPosts.length);
      } catch (err) {
        console.log(err);
      }
    };
    getInitialData();
  }, []);

  useEffect(() => {
    // establish WebSocket connection
    const newSocket = io("http://localhost:8000");

    // listen for new notifications
    newSocket.on("new_notification", () => {
      setUnreadNotifCount((prevCount) => prevCount + 1);
    });

    // listen for read notifications
    newSocket.on("notification_read", () => {
      setUnreadNotifCount((prevCount) => Math.max(0, prevCount - 1));
    });

    // listen for deleted, unread notifications
    newSocket.on("notification_deleted", () => {
      setUnreadNotifCount((prevCount) => Math.max(0, prevCount - 1));
    });

    // listen for newly saved posts
    newSocket.on("post_save", () => {
      setSavedPostCount((prevCount) => prevCount + 1);
    });

    // listen for newly unsaved posts
    newSocket.on("post_unsave", () => {
      setSavedPostCount((prevCount) => Math.max(0, prevCount - 1));
    });

    // listen for newly deleted posts
    newSocket.on("post_deleted", () => {
      setSavedPostCount((prevCount) => Math.max(0, prevCount - 1));
    });

    // WebSocket cleanup
    return () => newSocket.close();
  }, [currentUser]);

  return (
    <header className="header">
      <div className="logo-container">
        {currentUser ? (
          <Link to="/">
            <span className="logo-text">Reuse, Vandy!</span>
          </Link>
        ) : (
          <Link to="/access">
            <span className="logo-text">Reuse, Vandy!</span>
          </Link>
        )}
      </div>
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Search items on Reuse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <IoSearch />
          </button>
        </form>
      </div>
      <nav className="nav-container">
        <ul className="nav-list">
          <Link to="/saved" className="saved-icons">
            <li className="nav-item">
              <MdOutlineBookmarkAdd title="Saved" />
            </li>
            <span>{savedPostCount}</span>
          </Link>
          <Link to="/notifications" className="notification-icons">
            <li className="nav-item">
              <MdOutlineNotifications title="Notifiations" />
            </li>
            <span>{unreadNotifCount}</span>
          </Link>
          <Link to="messages">
            <li className="nav-item">
              <FiMessageSquare title="Messages" />
            </li>
          </Link>
          <Link to="profile">
            <li className="nav-item profile-link">
              <img src={currentUser.avatar} className="profile-avatar" />
              <span className="profile-name">
                Hello, {currentUser.firstName}
              </span>
            </li>
          </Link>
        </ul>
      </nav>
    </header>
  );
}
