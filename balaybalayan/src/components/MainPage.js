import React from 'react';
import './main.css'; // Import the CSS file
import './style.css'; // Ace's CSS file for random shit
import Navbar from './Navbar'; 
import banner from './photos/banner.png'; // Import the banner image


function MainPage() {
  return (
    <><div>
      <img id="banner" src={banner} alt="Banner" /> {/* Added an ID to the banner */}
    </div><div class="slide-container">
      <div class ="card-wrapper">
        <div class="card">
          <div class="image-content">
            <span class="overlay"></span>

            <div class="card-image">
              <img src="photos/dorm1.jpg" alt="" class="card-img"></img>
            </div>
          </div>
        </div>
      </div>
    </div><div className="amenities">
      <h2>Amenities</h2>
      <ul>
        <li>Free Wi-Fi</li>
        <li>24/7 Security</li>
        <li>Study Lounges</li>
        <li>Fitness Center</li>
        <li>Laundry Facilities</li>
        <li>Common Room</li>
      </ul>
    </div></>
  );
}

export default MainPage;
