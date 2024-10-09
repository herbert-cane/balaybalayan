import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate, Link } from 'react-router-dom';
import mainimage from './image2.png'; 
import './Login.css';

const LoginManager = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setRedirect(true);
    } catch (error) {
      setError(error.message); 
    }
  };

  if (user && redirect) {
    return <Navigate to="/dorm-manager" replace />;
  }

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={mainimage} alt="Login Visual" />
      </div>
      <div className="login-form">
        <h1>Log in</h1>
        <p>Lorem Ipsum</p>

        <div className="user-type-options">
          <div className="user-type-card selected">Dorm Manager</div>
          <Link to="/login/dormer">
            <div className="user-type-card">Dormer</div>
          </Link>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="login-btn">Log in</button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginManager;
