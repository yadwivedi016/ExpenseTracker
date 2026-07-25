import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./UserComponent/Registration";
import Login from "./UserComponent/Login";
import Home from "./ExpenseTracker/Home";
import Profile from "./UserComponent/Profile";
import Dashboard from "./ExpenseTracker/Dashboard";
import Navbar from "./ExpenseTracker/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;