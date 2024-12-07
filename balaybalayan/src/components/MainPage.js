import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import './script.js';
import banner from './photos/banner.png'; // Import the banner image
import dormimage from './photos/MainPage_Image.png'; // Import the placeholder image
import './main.css'; // Import the CSS file
import './swiper-bundle.min.css';

import DormCarousel from './DormCarousel.js';

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

  const handleCheckboxChange = async (option) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev, [option]: !prev[option] };
      onChange(updatedItems);  
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

function MainPage () {
  const navigate = useNavigate();
  const [filterSearchData, setFilterSearchData] = useState({});
  const [dormitories, setDormitories] = useState([]);
  const [filteredDormitories, setFilteredDormitories] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    location: '',
    dormType: '',
    amenities: {},
    priceRange: '',
  });
  const [loading, setLoading] = useState(true);
  const [searchClicked, setSearchClicked] = useState(false);


  // Fetch filterSearch and dormitories data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch filterSearch data
        const filterSearchSnapshot = await getDocs(collection(db, 'filterSearch'));
        const filterSearchData = filterSearchSnapshot.docs.map(doc => doc.data())[0]; // Assuming there's only one document
        setFilterSearchData(filterSearchData);

        // Fetch dormitories data
        const dormitoriesSnapshot = await getDocs(collection(db, 'dormitories'));
        const dormitoriesData = dormitoriesSnapshot.docs.map(doc => doc.data());
        setDormitories(dormitoriesData); // Store dormitories in state
        setFilteredDormitories(dormitoriesData); // Initialize filtered dormitories

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once

  // Function to filter dormitories based on selected options
  const filterDormitories = async () => {
    let results = dormitories;

    // Filter by Location (case-insensitive)
    if (filterOptions.location && filterOptions.location.trim() !== "") {
      results = results.filter(dorm => 
        dorm.dormAddress && dorm.dormAddress.toLowerCase().includes(filterOptions.location.toLowerCase().trim())
      );
    }

    // Filter by Dorm Type (case-insensitive)
    if (filterOptions.dormType && filterOptions.dormType.trim() !== "") {
      results = results.filter(dorm => 
        dorm.type && dorm.type.toLowerCase().includes(filterOptions.dormType.toLowerCase().trim())
      );
    }

    // Filter by Amenities (must match any selected amenities)
    if (Object.keys(filterOptions.amenities).length > 0) {
      results = results.filter(dorm => {
        return Object.keys(filterOptions.amenities).every(amenity => {
          return dorm.amenities && dorm.amenities.includes(amenity);
        });
      });
    }

    // Filter by Price Range
    if (filterOptions.priceRange) {
      const [selectedMinPrice, selectedMaxPrice] = parsePriceRange(filterOptions.priceRange);
      results = results.filter(dorm => {
        const [dormMinPrice, dormMaxPrice] = parsePriceRange(dorm.priceRange); // Access dorm price range correctly
        return dormMinPrice >= selectedMinPrice && dormMaxPrice <= selectedMaxPrice;
      });
    }

    // Update filtered dormitories
    setFilteredDormitories(results);
  };

  // Helper function to parse price range string
  const parsePriceRange = (priceRangeStr) => {
    const range = priceRangeStr.split(' - ').map(price => parseInt(price.replace('₱', '').replace(',', ''))); 
    return range.length === 1 ? [range[0], range[0]] : range;
  };

  // Trigger filter on search button click
  const handleSearchClick =  async() => {
    setSearchClicked(true);
    filterDormitories(); // Apply filter when search is clicked
  };
  return (
    <div>
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

      {/* Include Swiper scripts */}
      <script src={require("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js")}></script>
      <script src={require("./script.js")}></script>

      <div className='filter-dorm'>
        {/* Filter Controls */}
        <div className="find-dormitory-container"> {/* Separate class for Find Dormitory section */}
          {/* Left Side - Dropdowns and Amenities */}
          <div className="find-dormitory-card"> {/* Specific class for Find Dormitory Card */}
            <h2 className="card-title">Find Dormitory</h2>
            <br/>
            <Dropdown
            text="Location:"
            options={filterSearchData.locations || []}
            onSelect={(value) => setFilterOptions((prev) => ({ ...prev, location: value }))} 
            />
            <Dropdown
              text="Type:"
              options={filterSearchData.type || []}
              onSelect={(value) => setFilterOptions((prev) => ({ ...prev, dormType: value }))} 
            />
            <Dropdown
              text="Price Range:"
              options={filterSearchData.priceRange || []}
              onSelect={(value) => setFilterOptions((prev) => ({ ...prev, priceRange: value }))} 
            />
            <CheckboxGroup
              text="Amenities"
              options={filterSearchData.amenities || []}
              onChange={(value) => setFilterOptions((prev) => ({ ...prev, amenities: value }))} 
            />

            {/* Search Button */}
            <button onClick={handleSearchClick}>Search Dormitories</button>
            </div>
        </div> 
        {/* Right Side - Image */}
        <div className="find-dormitory-container">
          <img id='dormImage' src={dormimage} alt="Dormitory"/>
        </div>
      </div>

      {/* Loading State */}
      {loading && <p>Loading dormitories...</p>}

      {/* Display Filtered Dormitories */}
      {searchClicked && (
        filteredDormitories.length > 0 ? (
          <div>
            <h2>Matched Dormitories</h2>
            <br/>
            <div className='result-search-row'>
              {filteredDormitories.map((dorm, index) => (
                <div className='result-search'>
                  <div className='result-dorms-col'> 
                    <h4>{dorm.dormName} </h4>
                    <h6>Type:  {dorm.type} </h6>
                    <h6>Address:  {dorm.dormAddress} </h6>
                    <h6>Price:  {dorm.priceRange}</h6>
                    <br/>
                    <button
                      className="carousel-button"
                      onClick={() => navigate(dorm.path)}
                    >
                      Check Dormitory
                    </button>
                    <br/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No dormitories found matching your criteria.</p>
        )
      )}
    </div>
  );
};

export default MainPage;

