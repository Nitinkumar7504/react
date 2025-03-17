import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Signup.css"; // Import CSS for styling

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", { email, password });
      if (response.data.message === "User created successfully") {
        alert("Signup successful! Please login.");
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      alert("Error creating user. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup} className="signup-form">
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
        <button type="submit" className="signup-button">SignUp</button>
      </form>
      <div className="login-link">
        Already have an account?{" "}
        <button
          className="login-button"
          onClick={() => navigate("/login")} // Redirect to Login page
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;