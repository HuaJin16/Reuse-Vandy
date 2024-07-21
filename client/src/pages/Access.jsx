import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { GrPowerCycle } from "react-icons/gr";
import { VscPerson } from "react-icons/vsc";
import { LiaStoreAltSolid } from "react-icons/lia";
import "../styles/Access.css";

export default function Access() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newestUsers, setNewestUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newSocket = io("http://localhost:8000");

    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:8000/user/get`);
        const data = await res.json();
        if (data.userErrors) {
          setErrors(data.userErrors);
        } else {
          setTotalUsers(data.length);
          setNewestUsers(data.slice(-5).reverse());
        }
      } catch (err) {
        setErrors({ general: err.message });
      }
    };
    fetchUsers();

    // listen for new user registrations
    newSocket.on("new_user", (newUser) => {
      setTotalUsers((prevTotal) => prevTotal + 1);
      setNewestUsers((prevNewest) => {
        const updatedList = [newUser, ...prevNewest.slice(0, 4)];
        return updatedList;
      });
    });

    // listen for deleted users
    newSocket.on("user_deleted", (deletedUserId) => {
      setTotalUsers((prevTotal) => Math.max(0, prevTotal - 1));
      setNewestUsers((prevNewest) =>
        prevNewest.filter((user) => user._id !== deletedUserId)
      );
    });

    return () => newSocket.close();
  }, []);

  return (
    <div className="access-container">
      <div className="access-header">
        <h1 className="access-title">Reuse, Vandy!</h1>
        <h2 className="access-subtitle">
          A Campus Marketplace <LiaStoreAltSolid className="icon-store" />
        </h2>
      </div>
      <div className="access-main">
        <div className="access-icons">
          <VscPerson className="icon-person" />
          <GrPowerCycle className="icon-cycle" />
          <VscPerson className="icon-person" />
        </div>
        <div className="access-stats">
          <h2 className="user-stats-title">Total users: {totalUsers}</h2>
          <h2 className="new-user-title">Newly registered users:</h2>
          <ul className="new-user-list">
            {newestUsers.map((user, index) => (
              <li key={`${user._id}-${index}`} className="new-user-item">
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
          {errors.users && newestUsers.length === 0 && (
            <p className="access-error-message">{errors.users}</p>
          )}
        </div>
        <div className="access-links-container">
          <Link to="/register" className="access-link">
            <span>Create an account</span>
          </Link>
          <Link to="/login" className="access-link">
            <span>Log in</span>
          </Link>
        </div>
        {errors.general && (
          <p className="access-error-message">{errors.general}</p>
        )}
      </div>
    </div>
  );
}
