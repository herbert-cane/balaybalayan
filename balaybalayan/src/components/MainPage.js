import React from 'react';
import './main.css'; // Import the CSS file
import Navbar from './Navbar'; 
import banner from './photos/banner.png'; // Import the banner image

function MainPage() {
  return (
    <div>
      <img id="banner" src={banner} alt="Banner" /> {/* Added an ID to the banner */}
      <h1>Explore Dormitories</h1>
      <p>---Guest view---</p>

      {/* Amenities Section */}
      <div className="amenities">
        <h2>Amenities</h2>
        <ul>
          <li>Free Wi-Fi</li>
          <li>24/7 Security</li>
          <li>Study Lounges</li>
          <li>Fitness Center</li>
          <li>Laundry Facilities</li>
          <li>Common Room</li>
        </ul>
      </div>
    </div>
  );
}

export default MainPage;
