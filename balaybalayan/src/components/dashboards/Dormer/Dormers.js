import React, { useState } from 'react';
import DormNavBar from './DormerNavBar';
import DormerHomeSection from './DormerHomeSection';
import DormerProfile from './DormerProfileSection';
import DormerAccountInfo from './DormerAccountInfo';
import DormerRoommateInfo from './DormerRoommateInfo';
import './FullScreenToggle.css';

const Dormers = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <DormerHomeSection />;
      case 'profile':
        return  <DormerProfile />;
      case 'accountInfo':
        return <DormerAccountInfo />;
      case 'roommateInfo':
        return <DormerRoommateInfo />;
      default:
        return <DormerHomeSection />;
    }
  };

  return (
    <div className="main-layout">
      <DormNavBar setSection={setActiveSection} activeSection={activeSection} />
      <div className="section-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default Dormers;