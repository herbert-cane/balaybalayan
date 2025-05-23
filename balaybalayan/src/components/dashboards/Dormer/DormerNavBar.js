import React from 'react';
import { FaHome, FaUser, FaInfoCircle, FaBed, FaClipboardList, FaBook } from 'react-icons/fa';
import './DormerNavBar.css';

const DormerNavBar = ({ setSection, activeSection }) => {
  return (
    <div className="nav-bar">
      <button
        onClick={() => setSection('home')}
        className={`nav-button ${activeSection === 'home' ? 'active' : ''}`}
      >
        <FaHome /> Home
      </button>
      <button
        onClick={() => setSection('profile')}
        className={`nav-button ${activeSection === 'profile' ? 'active' : ''}`}
      >
        <FaUser /> Profile
      </button>
      <button
        onClick={() => setSection('accountInfo')}
        className={`nav-button ${activeSection === 'accountInfo' ? 'active' : ''}`}
      >
        <FaInfoCircle /> Account Information
      </button>
      <button
        onClick={() => setSection('roommateInfo')}
        className={`nav-button ${activeSection === 'roommateInfo' ? 'active' : ''}`}
      >
        <FaBed /> Room Information
      </button>
      <button
        onClick={() => setSection('dormerReports')}
        className={`nav-button ${activeSection === 'dormerReports' ? 'active' : ''}`}
      >
        <FaClipboardList /> Reports
      </button>
      <button
        onClick={() => setSection('rules')}
        className={`nav-button ${activeSection === 'rules' ? 'active' : ''}`}
      >
        <FaBook /> Rules and Regulations
      </button>
    </div>
  );
};

export default DormerNavBar;
