import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

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
          setNewestUsers(data.slice(-3).reverse());
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
    <div>
      <div>
        <h1>Reuse, Vandy!</h1>
        <h2>A Campus Marketplace</h2>
      </div>
      <div>
        <h2>Total users: {totalUsers}</h2>
        <h2>Newly registered users:</h2>
        <ul>
          {newestUsers.map((user, index) => (
            <li key={`${user._id}-${index}`}>
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
        {errors.users && newestUsers.length === 0 && <p>{errors.users}</p>}
      </div>
      <div>
        <button>
          <Link to="/register">
            <span>Create an account</span>
          </Link>
        </button>
        <button>
          <Link to="/login">
            <span>Log in</span>
          </Link>
        </button>
      </div>
      {errors.general && <p>{errors.general}</p>}
    </div>
  );
}
