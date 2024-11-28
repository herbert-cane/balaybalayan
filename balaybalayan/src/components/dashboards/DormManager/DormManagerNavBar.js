import React from 'react';
import './DormManagerNavBar.css';

const DormerNavBar = ({ setSection, activeSection }) => {
  return (
    <div className="nav-bar">
      <button
        onClick={() => setSection('overview')}
        className={`nav-button ${activeSection === 'overview' ? 'active' : ''}`}
      >
        Overview
      </button>
      <button
        onClick={() => setSection('requests')}
        className={`nav-button ${activeSection === 'requests' ? 'active' : ''}`}
      >
        Requests
      </button>
      <button
        onClick={() => setSection('rooms')}
        className={`nav-button ${activeSection === 'rooms' ? 'active' : ''}`}
      >
        Rooms
      </button>
      <button
        onClick={() => setSection('dormers')}
        className={`nav-button ${activeSection === 'dormers' ? 'active' : ''}`}
      >
        Dormers
      </button>
    </div>
  );
};

export default DormerNavBar;
