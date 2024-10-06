import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Custom CSS for styling
import pizzalogo from '../assets/pizzalogo.png'; // Import the pizza logo

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Send login request to the Django backend
        const response = await axios.post('http://localhost:8000/customers/login/', {
            username,
            password,
        });

        // Get the 'refresh' and 'access' tokens from the response and store them individually
        const { refresh, access } = response.data;  // Destructuring the response data

        // Store the tokens separately in localStorage
        localStorage.setItem('accessToken', access);  // Save access token
        localStorage.setItem('refreshToken', refresh);  // Save refresh token

        // Redirect the user to the homepage or another page after successful login
        window.location.href = '/';
    } catch (err) {
        setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src={pizzalogo}
          alt="Pizza Logo"
          className="login-logo"
        />
        <h1 className="login-heading">Welcome!</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="UserName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn-login">
            Log in
          </button>
        </form>
        <div className="create-account">
          <a href="/register">Create account</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
