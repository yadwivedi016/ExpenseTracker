import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/profile/", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error(error.response?.data);
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        {
          withCredentials: true,
        }
      );

      alert(response.data.message || "Logged out successfully.");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Logout failed.");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card profile-loading-card">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-line tiny"></div>
          <div className="skeleton-box"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const initial = user.first_name ? user.first_name[0].toUpperCase() : "U";

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Top Decorative Brass Accent Line */}
        <div className="card-top-accent"></div>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-ring">
            <div className="profile-avatar">
              <span>{initial}</span>
            </div>
          </div>

          <h2 className="user-fullname">
            {user.first_name} {user.last_name}
          </h2>

          <p className="username-handle">@{user.username}</p>

          <div className="account-tier-badge">
            <span className="tier-dot"></span>
            <span>Personal Account • Active</span>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="profile-info">
          <div className="info-row">
            <div className="row-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Email Address</span>
            </div>
            <strong className="row-value">{user.email}</strong>
          </div>

          <div className="info-row">
            <div className="row-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Username</span>
            </div>
            <strong className="row-value">{user.username}</strong>
          </div>

          <div className="info-row">
            <div className="row-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Member Since</span>
            </div>
            <strong className="row-value">{joinedDate}</strong>
          </div>

          <div className="info-row">
            <div className="row-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Security Status</span>
            </div>
            <strong className="row-value status-secure">Encrypted Session</strong>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={logoutLoading}
        >
          {logoutLoading ? (
            <>
              <span className="btn-spinner"></span>
              Signing Out...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;