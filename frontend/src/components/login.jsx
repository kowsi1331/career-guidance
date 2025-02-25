import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./login.css";
import user_icon from "./Assets/user.png";
import pass_icon from "./Assets/pasword.png";
import message_icon from "./Assets/message.png";
import { loginUser } from "../api";

const Auth = () => {
  const [userType, setUserType] = useState("student");
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
        const response = await loginUser(formData);
        
        if (!response.success) {
            setError(response.error || "Access Denied: Unauthorized user");
            setLoading(false);
            return;
        }
        
        localStorage.setItem("user", JSON.stringify(response.user)); // ✅ Store user session
        navigate("/home"); // ✅ Redirect to Home Page
    } catch (err) {
        setError("Something went wrong!");
    }
    setLoading(false);
};


  return (
    <div className="container">
      <div className="tabs">
        <button className={userType === "student" ? "active" : ""} onClick={() => setUserType("student")}>Student</button>
        <button className={userType === "admin" ? "active" : ""} onClick={() => { setUserType("admin"); setAction("Login"); }}>Admin</button>
      </div>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="inputs">
        {userType === "student" && action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="User" height={35} />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
          </div>
        )}
        <div className="input">
          <img src={message_icon} alt="Email" height={35} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="input">
          <img src={pass_icon} alt="Password" height={35} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
        </div>
      </div>
      <div className="submit-container">
        <button className={`submit ${loading ? "gray" : ""}`} onClick={handleSubmit} disabled={loading}>{loading ? "Processing..." : action}</button>
        {userType === "student" && (
          <button className="submit" onClick={() => setAction(action === "Sign Up" ? "Login" : "Sign Up")}>{action === "Sign Up" ? "LOGIN" : "SIGN UP"}</button>
        )}
      </div>
    </div>
  );
};

export default Auth;
