import React from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { MdOutlineBookmarkAdd, MdOutlineNotifications } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header>
      <div>
        <Link to="/access">
          <span>Reuse, Vandy!</span>
        </Link>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            placeholder="Search items on Reuse..."
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
