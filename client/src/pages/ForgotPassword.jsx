import { useState } from "react";
import { BiMailSend } from "react-icons/bi";
import { Link } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import "../styles/AuthPages.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setMessage(data.message);
        setEmail("");
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
            name="email"
            placeholder="School email"
            value={email}
            onChange={handleChange}
            className="auth-input"
          />
          {errors.email && (
            <span className="auth-error-message">{errors.email}</span>
          )}
        </div>
        <div className="auth-group">
          <button type="submit" className="auth-button">
            <BiMailSend className="auth-icon" /> Send Reset Link
          </button>
        </div>
      </form>
      {errors.general && (
        <span className="auth-error-message">{errors.general}</span>
      )}
      {message && <span className="auth-success-message">{message}</span>}
      <div className="auth-footer">
        <Link to="/login" className="auth-footer-login">
          <span className="footer-span">
            <BsSend className="auth-icon" /> Back To Login
          </span>
        </Link>
      </div>
    </div>
  );
}
