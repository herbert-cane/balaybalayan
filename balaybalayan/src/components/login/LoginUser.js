import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate, Link } from 'react-router-dom';
import mainimage from './image2.png';
import './Login.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
      // First, attempt to login
      const userCredential = await login(email, password);
      
      // Get user data from Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      // Check if user type matches selected type
      if (userData.role !== userType) {
        // Logout the user if wrong type selected
        await userCredential.user.delete();
        setError(`Invalid account type. Please login as ${userData.role}`);
        return;
      }

      setRedirect(true);
    } catch (error) {
      // Convert Firebase errors to user-friendly messages
      let errorMessage = "Invalid Username or Password";
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "Invalid Username or Password";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = "An error occurred. Please try again.";
      }
      
      setError(errorMessage);
    }
  };

  if (user && redirect) {
    return <Navigate to={userType === 'Dormer' ? '/dormers' : '/dorm-manager'} replace />; // check state to see if its dormer or dorm manager
  }

  return (
    <div className="login-container">
      <div className="geometric-shapes"></div>
      <div className="particles">
        {[...Array(100)].map((_, index) => (
          <div 
            key={index} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 15}s`,
              animationDelay: `-${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      <div className="login-form">
        <div className="login-image">
          <img src={mainimage} alt="Login Visual" />
        </div>
        <div className="form-content">
          <h1>Log in</h1>
          <p>Welcome to Balay-Balayan!</p>

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
