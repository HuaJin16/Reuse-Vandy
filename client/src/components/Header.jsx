import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { MdOutlineBookmarkAdd, MdOutlineNotifications } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { useSelector } from "react-redux";
import "../styles/Header.css";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
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
          <Link to="/saved">
            <li className="nav-item">
              <MdOutlineBookmarkAdd title="Saved" />
            </li>
          </Link>
          <Link to="/notifications">
            <li className="nav-item">
              <MdOutlineNotifications title="Notifiations" />
            </li>
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
