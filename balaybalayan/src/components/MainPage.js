import React from 'react';
import { useState } from "react";
import './script.js';
import banner from './photos/banner.png'; // Import the banner image
import dormimage from './photos/MainPage_Image.png'; // Import the placeholder image
import './main.css'; // Import the CSS file
import './swiper-bundle.min.css';

// Dropdown component with inline text
const Dropdown = ({ text, options }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
      <div className="dropdown-container">
          <span className="dropdown-text">{text}</span>
          <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="dropdown-select"
          >
              {options.map((option, index) => (
                  <option key={index} value={option}>
                      {option}
                  </option>
              ))}
          </select>
      </div>
  );
};

// Checkbox group component for amenities
const CheckboxGroup = ({ text, options }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (option) => {
      setCheckedItems((prev) => ({
          ...prev,
          [option]: !prev[option],
      }));
  };

  return (
      <div className="checkbox-group">
          <span className="dropdown-text">{text}</span>
          <div className="checkbox-container">
              {options.map((option, index) => (
                  <div key={index} className="checkbox-option">
                      <label>
                          <input
                              type="checkbox"
                              checked={checkedItems[option] || false}
                              onChange={() => handleCheckboxChange(option)}
                          />
                          {option}
                      </label>
                  </div>
              ))}
          </div>
      </div>
  );
};

// Dorm Filter Buttons

const DormFilterButtons = () => {
  // States to handle the active status of each button
  const [activeButton, setActiveButton] = useState(null);

  // Function to toggle the button's active state
  const toggleButton = (button) => {
    setActiveButton((prev) => (prev === button ? null : button));
  };

  return (
    <div className="dorm-filter-buttons">
      {/* University Button */}
      <button
        className={`filter-button ${activeButton === 'university' ? 'active' : ''}`}
        onClick={() => toggleButton('university')}
      >
        University
      </button>

      {/* Private Button */}
      <button
        className={`filter-button ${activeButton === 'private' ? 'active' : ''}`}
        onClick={() => toggleButton('private')}
      >
        Private
      </button>

      {/* View All Button */}
      <button
        className={`filter-button ${activeButton === 'viewAll' ? 'active' : ''}`}
        onClick={() => toggleButton('viewAll')}
      >
        View All
      </button>
    </div>
  );
};

// View All Button

const ViewAll = () => {
  return (
    <div className="view-all-container">
      <span className="view-all-text">View All</span>
      <span className="arrow">→</span>  {/* Arrow icon */}
    </div>
  );
};

function MainPage() {
  return (
    <>
    
    <div> {/* Banner */}
      <img id="banner" src={banner} alt="Banner" /> {/* Added an ID to the banner */}
    </div>
    
    <div class="ex-do"> {/* Dormitory Carousel */}
      <h2> Explore Dormitories</h2>
      <DormFilterButtons />
      </div>

      <div class="container-fluid swiper">
      <div class="slideContainer">
        <div class="card-wrapper swiper-wrapper">
          <div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm1.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm2.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm3.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm1.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm2.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm1.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div>
        </div>
      </div>
      <div class="swiper-button-next swiper-navBtn"></div>
      <div class="swiper-button-prev swiper-navBtn"></div>
      <div class="swiper-pagination"></div>
      <ViewAll />
    </div>
    
    <script src={require("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js")}></script>
    <script src={require("./script.js")}></script>

    <div className="amenities"> {/*Amenities Section and Placeholder Image */}

    <div className="card-container">
      {/* Left Side - Card with Dropdowns and Amenities */}
      <div className="card">
        <h2 className="card-title">Find Dormitory</h2>
        
        {/* Dropdown components */}
        <Dropdown text="Location:" options={['Mat-y', 'Inside UP', 'Hollywood']} />
        <Dropdown text="Type:" options={['University', 'Private']} />
        <Dropdown text="Number of Roommates:" options={['1', '2', '3', '4']} />
        <Dropdown text="Price Range:" options={['₱100 - ₱1000', '₱1001 - ₱2000', '₱2001 - ₱5000']} />

        {/* Checkbox group for amenities */}
        <CheckboxGroup text="Amenities" options={['WiFi', 'Aircon', 'Study Table', 'Mattress', 'Laundry Area']} />

        {/* Search button */}
        <button className="search-button">Search Dormitory</button>
      </div>

      {/* Right Side - Image */}
      <div className="image-container">
        <img src= {require("./photos/MainPage_Image.png")} alt="Dormitory" className="dormitory-image" />
      </div>
    </div>

    </div></>
  );
}

export default MainPage;
