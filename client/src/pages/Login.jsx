import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/user/userSlice.js";
import { TbLogin2 } from "react-icons/tb";
import "../styles/AuthPages.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userData = await res.json();
      if (userData.inputErrors) {
        setErrors(userData.inputErrors);
      } else {
        navigate("/");
        setData({});
        setErrors({});
        dispatch(setLogin(userData));
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
            <TbLogin2 className="auth-icon" /> Login
          </button>
        </div>
      </form>
      <div className="auth-forgot-password">
        <span>Forgot Password?</span>
      </div>
      <div className="auth-footer">
        <span className="auth-prompt">Dont have an account?</span>
        <Link to="/register" className="auth-footer-link">
          <span>Sign up</span>
        </Link>
      </div>
      {errors.general && (
        <span className="auth-error-message">{errors.general}</span>
      )}
    </div>
  );
}
