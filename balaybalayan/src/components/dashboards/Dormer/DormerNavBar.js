import React from 'react';
import './DormerNavBar.css';

const DormerNavBar = ({ setSection, activeSection }) => {
  return (
    <div className="nav-bar">
      <button
        onClick={() => setSection('home')}
        className={`nav-button ${activeSection === 'home' ? 'active' : ''}`}
      >
        Home
      </button>
      <button
        onClick={() => setSection('profile')}
        className={`nav-button ${activeSection === 'profile' ? 'active' : ''}`}
      >
        Profile
      </button>
      <button
        onClick={() => setSection('accountInfo')}
        className={`nav-button ${activeSection === 'accountInfo' ? 'active' : ''}`}
      >
        Account Information
      </button>
      <button
        onClick={() => setSection('roommateInfo')}
        className={`nav-button ${activeSection === 'roommateInfo' ? 'active' : ''}`}
      >
        Room Information
      </button>
    </div>
  );
};

export default DormerNavBar;
