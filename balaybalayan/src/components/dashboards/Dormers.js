import React, { useState } from 'react';
import './FullScreenToggle.css';
import DormNavBar from './DormNavBar';
import HomeSection from './HomeSection';


const Dormers = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'profile':
        return <h2>Profile wala pa kami kahimo</h2>;
      case 'accountInfo':
        return <h2>Account Info wala pa kami kahimo</h2>;
      case 'roommateInfo':
        return<h2>Roommate Info wala pa kami kahimo</h2>;
      default:
        return <HomeSection />;
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
