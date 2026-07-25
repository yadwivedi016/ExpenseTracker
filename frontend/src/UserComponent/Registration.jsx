import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/Registration.css";

const Registration = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
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
        "http://localhost:8000/api/register/",
        formData,
        {
          withCredentials: true,
        }
      );

      alert(response.data.message);

      navigate("/login");

    } catch (error) {

      if (error.response) {

        if (error.response.data.message) {
          setError(error.response.data.message);
        } else {

          const errors = error.response.data;

          const firstError = Object.values(errors)[0][0];
          setError(firstError);
        }

      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <span className="card-eyebrow">Open An Account</span>
        <h1>Create Account</h1>
        <p>Register to start tracking your expenses.</p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">

            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            Register
          </button>

        </form>

        <div className="login-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Registration;
