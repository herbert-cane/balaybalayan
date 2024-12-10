import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate, Link } from 'react-router-dom';
import mainimage from './image2.png';
import './Login.css';

const Login = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [userType, setUserType] = useState('Dormer'); // Dormer (default) or Dorm Manager 

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
    return <Navigate to={userType === 'Dormer' ? '/dormers' : '/dorm-manager'} replace />; // check state to see if its dormer or dorm manager
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-image">
          <img src={mainimage} alt="Login Visual" />
        </div>
        <div className="form-content">
          <h1>Log in</h1>
          <p>Welcome to balay-balayan!</p>

          <div className="user-type-options">
            <div
              className={`user-type-card ${userType === 'Dorm Manager' ? 'selected' : ''}`}
              onClick={() => setUserType('Dorm Manager')}
            >
              Dorm Manager
            </div>
            <div
              className={`user-type-card ${userType === 'Dormer' ? 'selected' : ''}`}
              onClick={() => setUserType('Dormer')}
            >
              Dormer
            </div>
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
    </div>
  );
};

export default Login;
