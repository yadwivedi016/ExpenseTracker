import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "../Styles/Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/profile/", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      {/* Background Glow Lighting */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      <section className="hero">
        <div className="hero-content">
          {loading ? (
            <div className="hero-loading">
              <span className="spinner"></span>
              <p>Checking authentication status...</p>
            </div>
          ) : user ? (
            /* Logged-In User Hero View */
            <div className="user-hero-view">
              <span className="hero-eyebrow user-badge">
                <span className="online-pulse"></span> Welcome Back
              </span>

              <h1>
                Hello, <span className="gradient-text">{user.first_name || user.username}</span>! 👋
              </h1>
              <h1>Ready to Manage Your Finances?</h1>

              <p>
                Your personal ledger is up to date. Track your income, categorize
                expenses, and stay on top of your financial goals.
              </p>

              <div className="hero-buttons">
                <Link className="primary-btn dashboard-btn" to="/dashboard">
                  <span>Go to Dashboard</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <Link className="secondary-btn profile-btn" to="/profile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Guest / Logged-Out Hero View */
            <div className="guest-hero-view">
              <span className="hero-eyebrow">Personal Ledger</span>

              <h1>Track Every Expense.</h1>
              <h1 className="gradient-text">Achieve Every Goal.</h1>

              <p>
                Manage your income and expenses effortlessly.
                Stay organized, analyze your spending,
                and build better financial habits.
              </p>

              <div className="hero-buttons">
                <Link className="primary-btn" to="/register">
                  Get Started
                </Link>

                <Link className="secondary-btn" to="/login">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features / Quick Action Section */}
      <section className="features">
        {user ? (
          /* Logged-In Quick Action Cards */
          <>
            <div className="feature-card user-action-card">
              <div className="feature-icon icon-indigo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <h3>Add New Transaction</h3>
              <p>Quickly log income or expense items directly to your ledger.</p>
              <Link to="/dashboard" className="card-link">Open Transaction Form →</Link>
            </div>

            <div className="feature-card user-action-card">
              <div className="feature-icon icon-emerald">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <h3>Manage Categories</h3>
              <p>Create and customize tags for accurate spending classification.</p>
              <Link to="/dashboard" className="card-link">View Categories →</Link>
            </div>

            <div className="feature-card user-action-card">
              <div className="feature-icon icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Account Settings</h3>
              <p>View your profile details, registered email, and session info.</p>
              <Link to="/profile" className="card-link">Manage Account →</Link>
            </div>
          </>
        ) : (
          /* Guest Features Cards */
          <>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="12" r="6" />
                  <path d="M14 8.5a6 6 0 1 1 0 7" />
                </svg>
              </div>
              <h3>Income &amp; Expense</h3>
              <p>Record every transaction with custom categories.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20V10M12 20V4M20 20v-7" />
                </svg>
              </div>
              <h3>Dashboard</h3>
              <p>Monitor your balance and spending trends.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />
                </svg>
              </div>
              <h3>Categories</h3>
              <p>Organize your income and expenses efficiently.</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;