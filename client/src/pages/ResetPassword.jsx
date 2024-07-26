import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MdOutlineLockReset } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import "../styles/AuthPages.css";

export default function ResetPassword() {
  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const { token } = useParams();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setErrors({ general: "Passwords do not match" });
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: data.password }),
        }
      );
      const resData = await res.json();
      if (resData.errors) {
        setErrors(resData.errors);
      } else {
        setMessage(resData.message);
        setData({ password: "", confirmPassword: "" });
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
            type="password"
            name="password"
            placeholder="New password"
            value={data.password}
            onChange={handleChange}
            className="auth-input"
          />
        </div>
        <div className="auth-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={data.confirmPassword}
            onChange={handleChange}
            className="auth-input"
          />
        </div>
        <div className="auth-group">
          <button type="submit" className="auth-button">
            <MdOutlineLockReset className="auth-icon" /> Reset Password
          </button>
        </div>
      </form>
      {errors.auth ||
        errors.users ||
        (errors.general && (
          <span className="auth-error-message">
            {errors.auth || errors.users || errors.general}
          </span>
        ))}
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
