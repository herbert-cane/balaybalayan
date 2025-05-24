import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import DormerNavBar from './DormerNavBar';
import './DormerDashboard.css';
import DormerHome from './DormerHome';
import DormerRules from './DormerRules';

const DormerDashboard = ({ user }) => {
  const [activeSection, setSection] = useState('home');

  if (!user?.isVerified) {
    return (
      <div className="verification-message">
        <h2>Account Pending Verification</h2>
        <p>Your account is currently pending verification by an administrator.</p>
        <p>You will be able to access the dashboard once verified.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <DormerHome />;
      case 'rules':
        return <DormerRules />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <DormerNavBar setSection={setSection} activeSection={activeSection} />
      <div className="dashboard-content">{renderSection()}</div>
    </div>
  );
};

export default DormerDashboard;