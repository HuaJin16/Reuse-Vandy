import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/user/userSlice.js";

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
    <div>
      <div>
        <Link to="/access">
          <span>Reuse, Vandy!</span>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <div>
        <span>Forgot Password?</span>
      </div>
      <div>
        <span>Dont have an account?</span>
        <Link to="/register">
          <span>Sign up</span>
        </Link>
      </div>
      {errors.general && <span>{errors.general}</span>}
    </div>
  );
}
