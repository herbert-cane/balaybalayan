import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Include useNavigate for programmatic navigation
import './Signup.css';
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
      <div className="signup-image">
        <img src={mainimage} alt="Signup Visual" />
      </div>
      <div className="signup-form">
        <h1>Welcome!</h1>
        <p>Lorem Ipsum</p>
        <h3>Sign up as:</h3>
        <div className="user-type-options">
          <div 
            className={`user-type-card ${userType === 'Dorm Manager' ? 'selected' : ''}`} 
            onClick={() => handleUserTypeChange('Dorm Manager')}
          >
            <h4>Dorm Manager</h4>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
          <div 
            className={`user-type-card ${userType === 'Dormer' ? 'selected' : ''}`} 
            onClick={() => handleUserTypeChange('Dormer')}
          >
            <h4>Dormer</h4>
            <p >Lorem ipsum dolor sit amet.</p>
          </div>
        </div>

        {/* Information text */}
        <div className="info-container">
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
  );
};

export default MainSignup;
