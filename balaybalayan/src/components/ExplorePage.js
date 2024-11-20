import React, { useState } from 'react';
import './explorePage.css';

function ExplorePage() {
  const [view, setView] = useState('all'); // Track which view is selected

  // Function to handle changing views
  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  return (
    <div className="explore-page">
      {/* Header Section */}
      <div className="explore-header">
        <h1>Explore Dormitories</h1>
        <p>Welcome to the Explore Page! Browse through available dormitories below.</p>
      </div>

      {/* View Selection */}
      <div className="view-selection">
        <button
          className={view === 'all' ? 'active' : ''}
          onClick={() => handleViewChange('all')}
        >
          View All
        </button>
        <button
          className={view === 'university' ? 'active' : ''}
          onClick={() => handleViewChange('university')}
        >
          University
        </button>
        <button
          className={view === 'private' ? 'active' : ''}
          onClick={() => handleViewChange('private')}
        >
          Private
        </button>
      </div>

      {/* Dorm Cards Section */}
      <div className="dorm-list">
        {/* Show dorm cards based on the selected view */}
        {view === 'all' && (
          <>
            <div className="explore-dorm-card">Dorm 1</div>
            <div className="explore-dorm-card">Dorm 2</div>
            <div className="explore-dorm-card">Dorm 3</div>
          </>
        )}
        {view === 'university' && (
          <>
            <div className="explore-dorm-card">University Dorm 1</div>
            <div className="explore-dorm-card">University Dorm 2</div>
          </>
        )}
        {view === 'private' && (
          <>
            <div className="explore-dorm-card">Private Dorm 1</div>
            <div className="explore-dorm-card">Private Dorm 2</div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
