import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8000/api/login/",
        formData,
        {
          withCredentials: true,
        }
      );

      alert(response.data.message);

      navigate("/");

    } catch (error) {

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong.");
      }

    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <span className="card-eyebrow">Member Access</span>
        <h1>Login</h1>
        <p>Welcome back! Sign in to continue.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Username or Email</label>
            <input
              type="text"
              name="login"
              placeholder="Enter username or email"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <div className="login-link">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
