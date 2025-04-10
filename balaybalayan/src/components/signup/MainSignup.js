import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './mainSignUp.css';
import mainimage from './image2.png';

const MainSignup = () => {
  const [userType, setUserType] = useState(''); // Same as old Signup.js
  const navigate = useNavigate(); // New navigation approach

  // Handle user type selection
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // Handle continue button click
  const handleContinue = () => {
    if (!userType) {
      alert('Please select a user type!');
      return;
    }

    // Navigate to the appropriate signup page based on user type
    if (userType === 'Dorm Manager') {
      navigate('/signup/manager'); // Route for Dorm Manager
    } else if (userType === 'Dormer') {
      navigate('/signup/dormer'); // Route for Dormer
    }

    console.log('Selected user type:', userType); // Log for debugging
  };

  return (
    <div className="signup-container">
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
      <div className="signup-form">
        <div className="signup-image">
          <img src={mainimage} alt="Signup Visual" />
        </div>
        <div className="form-content">
          <h1>Sign up</h1>
          <p>Welcome to balay-balayan!</p>
          <p>Sign up as:</p>

          <div className="user-type-options">
            <div
              className={`user-type-card ${userType === 'Dorm Manager' ? 'selected' : ''}`}
              onClick={() => handleUserTypeChange('Dorm Manager')}
            >
              <h4>Dorm Manager</h4>
              <p>You are managing a dormitory in UPV.</p>
            </div>
            <div
              className={`user-type-card ${userType === 'Dormer' ? 'selected' : ''}`}
              onClick={() => handleUserTypeChange('Dormer')}
            >
              <h4>Dormer</h4>
              <p>You are a student in UPV looking for a dormitory.</p>
            </div>
          </div>

          {/* Information text */}
          <div className="info-container" style={{ textAlign: 'center' }}>
            {userType === 'Dorm Manager' && (
              <p className="info-text">Manage the dormitory.</p>
            )}
            {userType === 'Dormer' && (
              <p className="info-text">Live in the dormitory.</p>
            )}
          </div>

          <button className="continue-btn" onClick={handleContinue}>
            Continue
          </button>

          <div style={{ marginTop: '20px' }}>
            <p className="signup-link">
              Already have an account? <Link to="/login/dormer">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSignup;
