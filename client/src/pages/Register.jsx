import { useState } from "react";
import { Link } from "react-router-dom";
import { BsPersonPlusFill } from "react-icons/bs";
import "../styles/AuthPages.css";

export default function Register() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

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
        setMessage(userData.message);
        setData({ firstName: "", lastName: "", email: "", password: "" });
        setErrors({});
      }
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="auth-container">
      <Link to="/access" className="auth-link">
        <span className="auth-logo-text">Reuse, Vandy!</span>
      </Link>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-group">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={data.firstName}
            onChange={handleChange}
            className="auth-input"
          />
          {errors.firstName && (
            <span className="auth-error-message">{errors.firstName}</span>
          )}
        </div>
        <div className="auth-group">
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={data.lastName}
            onChange={handleChange}
            className="auth-input"
          />
          {errors.lastName && (
            <span className="auth-error-message">{errors.lastName}</span>
          )}
        </div>
        <div className="auth-group">
          <input
            type="text"
            name="email"
            placeholder="School email"
            value={data.email}
            onChange={handleChange}
            className="auth-input"
          />
          {errors.email && (
            <span className="auth-error-message">{errors.email}</span>
          )}
        </div>
        <div className="auth-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            className="auth-input"
          />
          {errors.password && (
            <span className="auth-error-message">{errors.password}</span>
          )}
        </div>
        <div className="auth-group">
          <button type="submit" className="auth-button">
            <BsPersonPlusFill className="auth-icon" /> Register
          </button>
        </div>
      </form>
      <div className="auth-footer">
        <span className="auth-prompt">Already have an account?</span>
        <Link to="/login" className="auth-footer-link">
          <span>Sign in</span>
        </Link>
      </div>
      {message && <span className="auth-success-message">{message}</span>}
      {errors.general ||
        (errors.auth && (
          <span className="auth-error-message">
            {errors.general || errors.auth}
          </span>
        ))}
    </div>
  );
}
