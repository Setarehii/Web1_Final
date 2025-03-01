import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users");

      if (response.ok) {
        const users = await response.json();

        const foundUser = users.find((user) => user.email === email && user.password === password);

        if (foundUser) {
          setError(""); 
          
          localStorage.setItem("userId", foundUser.id)
          localStorage.setItem("userEmail", foundUser.email); 
          
          navigate("/booklist"); 
        } else {
          setError("Incorrect email or password.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to login. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred while logging in.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>

        <p>
          Don't have an account?
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
