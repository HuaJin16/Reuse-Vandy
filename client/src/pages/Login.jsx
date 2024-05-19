import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
      if (!userData.error) {
        navigate("/");
        setData({});
      }
    } catch (err) {
      console.log(err);
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
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
        />
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
    </div>
  );
}
