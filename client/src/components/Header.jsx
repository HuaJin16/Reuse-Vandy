import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { MdOutlineBookmarkAdd, MdOutlineNotifications } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { useSelector } from "react-redux";

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
    <header>
      <div>
        {currentUser ? (
          <Link to="/">
            <span>Reuse, Vandy!</span>
          </Link>
        ) : (
          <Link to="/access">
            <span>Reuse, Vandy!</span>
          </Link>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            placeholder="Search items on Reuse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <IoSearch />
          </button>
        </form>
      </div>
      <nav>
        <ul>
          <Link to="/saved">
            <li>
              <MdOutlineBookmarkAdd title="Saved" />
            </li>
          </Link>
          <Link to="/notifications">
            <li>
              <MdOutlineNotifications title="Notifiations" />
            </li>
          </Link>
          <Link to="messages">
            <li>
              <FiMessageSquare title="Messages" />
            </li>
          </Link>
          <Link to="profile">
            <li>
              <img src={currentUser.avatar} />
              <span>Hello, {currentUser.firstName}</span>
            </li>
          </Link>
        </ul>
      </nav>
    </header>
  );
}
