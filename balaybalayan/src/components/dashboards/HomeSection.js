import React from 'react';
import './HomeSection.css';

const HomeSection = () => {
  return (
    <div className="home-container">
      {/* First Section - Dormitory Info */}
      <div className="dorm-info">
        <img src="dorm-image.jpg" alt="Dormitory" className="dorm-image" />
        <h2 className="dorm-name">Dormitory Name</h2>
        <p className="dorm-address">123 Dormitory Street, City</p>
        <p className="dorm-details">₱1000 - ₱5000 | Visitors Allowed | Curfew: 10 PM</p>
      </div>

      {/* Second Section - Announcements */}
      <div className="announcements">
        <h2 className="section-title">Announcements</h2>
        <div className="announcement-content">
          {/* Dynamic content here */}
          <p>No announcements at this time.</p>
        </div>
      </div>

      {/* Third Section - Upcoming Events */}
      <div className="upcoming-events">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-content">
          {/* Dynamic events content here */}
          <p>No events scheduled.</p>
        </div>
      </div>

      {/* Fourth Section - Manager Info and Request/Report */}
      <div className="manager-request-container">
        {/* Manager Info Block */}
        <div className="manager-info">
          <div className="manager-card">
            <div className="manager-left">
              <img src="manager-photo.jpg" alt="Dorm Manager" className="manager-photo" />
              <h3 className="manager-name">John Doe</h3>
              <p className="manager-title">Dorm Manager</p>
            </div>
            <div className="manager-right">
              <h4>Contact Information</h4>
              <p><span className="icon phone-icon" /> 09123456789</p>
              <p><span className="icon telephone-icon" /> 123-4567</p>
              <p><span className="icon email-icon" /> manager@example.com</p>
            </div>
          </div>
        </div>

        {/* Request/Report Block */}
        <div className="request-report">
          <h2 className="section-title">Request or Report</h2>
          <div className="request-options">
            <button className="request-option">Drinking Water</button>
            <button className="request-option">Water</button>
            <button className="request-option">WiFi</button>
            <button className="request-option">Permit</button>
            <button className="request-option">Laundry</button>
            <button className="request-option">Maintenance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
