import React, { useState } from "react";
import "./login.css";
import user_icon from "./Assets/user.png";
import pass_icon from "./Assets/pasword.png";
import message_icon from "./Assets/message.png";

const Login = () => {
  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) return "Invalid email format!";
    if (formData.password.length < 6) return "Password must be at least 6 characters!";
    if (action === "Sign Up" && !formData.username) return "Username is required!";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    const endpoint = action === "Sign Up" ? "register" : "login";

    try {
      const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Success!"); // Replace with a better success UI
        setFormData({ username: "", email: "", password: "" });
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <img src={user_icon} alt="" height={35} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="input">
          <img src={message_icon} alt="" height={35} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input">
          <img src={pass_icon} alt="" height={35} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
      </div>
      {action === "Sign Up" ? null : (
        <div className="password">
          Forgot password? <span>Click here!</span>
        </div>
      )}
      <div className="submit-container">
        <button
          className={`submit ${loading ? "gray" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : action}
        </button>
        <button className="submit" onClick={() => setAction(action === "Sign Up" ? "Login" : "Sign Up")}>
          {action === "Sign Up" ? "LOGIN" : "SIGN UP"}
        </button>
      </div>
    </div>
  );
};

export default Login;
