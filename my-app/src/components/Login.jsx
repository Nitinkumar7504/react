import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      console.log("Login Response:", response.data); // Debugging

      if (response.data.message === "✅ Login successful") {
        localStorage.setItem("token", response.data.token);  
        setUser(!!localStorage.getItem("token"));  // Ensure state sync
        navigate("/dashboard");  
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="signup-link">
        Don't have an account?{" "}
        <button className="signup-button" onClick={() => navigate("/signup")}>
          SignUp
        </button>
      </div>
    </div>
  );
};

export default Login;
