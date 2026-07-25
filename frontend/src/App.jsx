import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Registration from "./UserComponent/Registration";
import Login from "./UserComponent/Login";
import Home from "./ExpenseTracker/Home";
import Profile from "./UserComponent/Profile";
import Dashboard from "./ExpenseTracker/Dashboard";
import Navbar from "./ExpenseTracker/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <BrowserRouter>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />

        <Route
          path="/login"
          element={
            <Login
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route
          path="/register"
          element={<Registration isAuthenticated={isAuthenticated} />}
        />

        <Route
          path="/profile"
          element={
            <Profile
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;