import React from 'react';
import { MdDashboard, MdPeople } from 'react-icons/md';
import { FaClipboardList, FaDoorOpen } from 'react-icons/fa';
import './DormManagerNavBar.css';

const DormerNavBar = ({ setSection, activeSection }) => {
  return (
    <div className="nav-bar">
      <button
        onClick={() => setSection('overview')}
        className={`nav-button ${activeSection === 'overview' ? 'active' : ''}`}
      >
        <MdDashboard className="nav-icon" />
        <span>Overview</span>
      </button>
      <button
        onClick={() => setSection('requests')}
        className={`nav-button ${activeSection === 'requests' ? 'active' : ''}`}
      >
        <FaClipboardList className="nav-icon" />
        <span>Requests</span>
      </button>
      <button
        onClick={() => setSection('rooms')}
        className={`nav-button ${activeSection === 'rooms' ? 'active' : ''}`}
      >
        <FaDoorOpen className="nav-icon" />
        <span>Rooms</span>
      </button>
      <button
        onClick={() => setSection('dormers')}
        className={`nav-button ${activeSection === 'dormers' ? 'active' : ''}`}
      >
        <MdPeople className="nav-icon" />
        <span>Dormers</span>
      </button>
    </div>
  );
};

export default DormerNavBar;
