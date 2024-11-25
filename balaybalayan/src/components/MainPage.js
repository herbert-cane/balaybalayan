import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './script.js';
import banner from './photos/banner.png'; // Import the banner image
import dormimage from './photos/MainPage_Image.png'; // Import the placeholder image
import './main.css'; // Import the CSS file
import './swiper-bundle.min.css';
import ExplorePage from './ExplorePage'; // Correct path for ExplorePage

import DormCard from './DormCard.js';
import DormCarousel from './DormCarousel.js';
import dormData from './DormData.js';

// Dropdown component with inline text
const Dropdown = ({ text, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    onSelect(e.target.value); // Pass the selected option back to parent
  };

  return (
    <div className="dropdown-container">
      <span className="dropdown-text">{text}</span>
      <select
        value={selectedOption}
        onChange={handleChange}
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
const CheckboxGroup = ({ text, options, onChange }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (option) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev, [option]: !prev[option] };
      onChange(updatedItems); // Pass checked items back to parent
      return updatedItems;
    });
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
  const navigate = useNavigate(); // Use navigate hook for routing

  // States to handle the active status of each button
  const [activeButton, setActiveButton] = useState(null);

  // Function to toggle the button's active state
  const toggleButton = (button) => {
    setActiveButton((prev) => (prev === button ? null : button));

    // Navigate to ExplorePage if "View All" is clicked
    if (button === 'viewAll') {
      navigate('/Explore'); // Route to ExplorePage
    }
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

function MainPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [dormType, setDormType] = useState('');
  const [roommates, setRoommates] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [amenities, setAmenities] = useState({});

  return (
    <>
      <div> {/* Banner */}
        <img id="banner" src={banner} alt="Banner" /> {/* Added an ID to the banner */}
      </div>

      <div className="ex-do"> {/* Dormitory Carousel Section */}
        <h2>Explore Dormitories</h2>
        <DormFilterButtons />
      </div>
      
      <div>
        <DormCarousel />
      </div>
<<<<<<< Updated upstream

      {/* Include Swiper scripts */}
      <script src={require("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js")}></script>
      <script src={require("./script.js")}></script>
=======
      
    {/* Include Swiper scripts */}
    <script src={require("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js")}></script>
    <script src={require("./script.js")}></script>
>>>>>>> Stashed changes

      <div className="find-dormitory-container"> {/* Separate class for Find Dormitory section */}
        {/* Left Side - Dropdowns and Amenities */}
        <div className="find-dormitory-card"> {/* Specific class for Find Dormitory Card */}
          <h2 className="card-title">Find Dormitory</h2>
          
          {/* Dropdown components */}
          <Dropdown text="Location:" options={['Mat-y', 'Inside UP', 'Hollywood']} onSelect={setLocation} />
          <Dropdown text="Type:" options={['University', 'Private']} onSelect={setDormType} />
          <Dropdown text="Number of Roommates:" options={['1', '2', '3', '4']} onSelect={setRoommates} />
          <Dropdown text="Price Range:" options={['₱100 - ₱1000', '₱1001 - ₱2000', '₱2001 - ₱5000']} onSelect={setPriceRange} />

          {/* Checkbox group for amenities */}
          <CheckboxGroup 
            text="Amenities" 
            options={['WiFi', 'Aircon', 'Study Table', 'Mattress', 'Laundry Area']} 
            onChange={setAmenities} 
          />

          {/* Search button */}
          <button className="search-button">Search Dormitory</button>
        </div>

        {/* Right Side - Image */}
        <div className="image-container">
          <img id='dormImage' src={dormimage} alt="Dormitory"/>
        </div>
      </div>
    </>
  );
}

export default MainPage;
