import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div>
        <Link to="/access">
          <span>Reuse, Vandy!</span>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={data.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={data.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="School email"
          value={data.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
      <div>
        <span>Already have an account?</span>
        <Link to="/login">
          <span>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
