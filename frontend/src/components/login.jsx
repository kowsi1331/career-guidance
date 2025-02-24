import React, { useState } from "react";
import "./login.css";
import user_icon from "./Assets/user.png";
import pass_icon from "./Assets/pasword.png";
import message_icon from "./Assets/message.png";
import { registerUser, loginUser } from "../api";

const Auth = () => {
  const [userType, setUserType] = useState("student");
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) return "Invalid email format!";
    if (formData.password.length < 6) return "Password must be at least 6 characters!";
    if (userType === "student" && action === "Sign Up" && !formData.username) return "Username is required!";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const endpoint = userType === "student" ? "/student" : "/admin";
      const response = action === "Sign Up" && userType === "student" ? await registerUser(formData, endpoint) : await loginUser(formData, endpoint);
      alert(response.data.message);
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
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
            <img src={user_icon} alt="" height={35} />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
          </div>
        )}
        <div className="input">
          <img src={message_icon} alt="" height={35} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="input">
          <img src={pass_icon} alt="" height={35} />
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
