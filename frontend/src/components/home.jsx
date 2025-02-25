import React from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="home-container">
      <h1>Welcome, {user?.username || "User"}!</h1>
      <p>This is your dashboard.</p>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
