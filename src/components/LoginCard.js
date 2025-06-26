// components/LoginCard.jsx
import React from 'react';

const LoginCard = ({ loginData, setLoginData, handleLogin, error }) => (
  <div className="login-card">
    <h2>Sign In</h2>
    <input
      className="input-field"
      placeholder="Enter your User ID"
      value={loginData.id}
      onChange={e => setLoginData({ ...loginData, id: e.target.value })}
      aria-label="User ID"
    />
    <input
      type="password"
      className="input-field"
      placeholder="Enter your Password"
      value={loginData.password}
      onChange={e => setLoginData({ ...loginData, password: e.target.value })}
      aria-label="Password"
    />
    {error && <p className="error-message">{error}</p>}
    <button className="login-btn" onClick={handleLogin}>Log In</button>
  </div>
);

export default LoginCard;
