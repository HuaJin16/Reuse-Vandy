import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userData = await res.json();
      if (userData.inputErrors) {
        setErrors(userData.inputErrors);
      } else {
        navigate("/login");
        setData({});
        setErrors({});
      }
    } catch (err) {
      setErrors({ general: err.message });
    }
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
        {errors.firstName && <span>{errors.firstName}</span>}
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={data.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <span>{errors.lastName}</span>}
        <input
          type="text"
          name="email"
          placeholder="School email"
          value={data.email}
          onChange={handleChange}
        />
        {errors.email && <span>{errors.email}</span>}
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
        />
        {errors.password && <span>{errors.password}</span>}
        <button type="submit">Register</button>
      </form>
      <div>
        <span>Already have an account?</span>
        <Link to="/login">
          <span>Sign in</span>
        </Link>
      </div>
      {errors.general && <span>{errors.general}</span>}
    </div>
  );
}
