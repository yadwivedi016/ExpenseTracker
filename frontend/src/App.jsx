import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react"; // 1. Import useState
import Registration from "./UserComponent/Registration";
import Login from "./UserComponent/Login";
import Home from "./ExpenseTracker/Home";
import Profile from "./UserComponent/Profile";
import Dashboard from "./ExpenseTracker/Dashboard";
import Navbar from "./ExpenseTracker/Navbar";

function App() {
  // 2. Define global user state
  const [user, setUser] = useState(null); 

  return (
    <BrowserRouter>
      {/* 3. Pass user and setUser to Navbar so it re-renders instantly */}
      <Navbar user={user} setUser={setUser} /> 
      
      <Routes>
        {/* 4. Pass user to Home to hide/show guest content */}
        <Route path="/" element={<Home user={user} />} /> 
        
        {/* 5. Pass setUser to Login to update the application state */}
        <Route path="/login" element={<Login setUser={setUser} />} /> 
        
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/Dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
