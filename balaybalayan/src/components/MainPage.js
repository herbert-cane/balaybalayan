import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import './script.js';
import banner from './photos/banner.png'; // Import the banner image
import dormimage from './photos/MainPage_Image.png'; // Import the placeholder image
import './main.css'; // Import the CSS file
import './swiper-bundle.min.css';

import DormCard from './DormCard.js';
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

  const handleCheckboxChange = (option) => {
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

function MainPage() {
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

  // Helper functions
  const parsePriceRange = (priceRangeStr) => {
    const range = priceRangeStr.split('-').map(price =>
      parseInt(price.replace('₱', '').replace(',', '').trim())
    );
    return range.length === 1 ? [range[0], range[0]] : range;
  };

  const categorizePriceRange = (priceRange) => {
    const [minPrice] = parsePriceRange(priceRange);

    if (minPrice < 1000) {
      return "<₱1000";
    } else if (minPrice >= 1000 && minPrice < 2000) {
      return "₱1000 - ₱1999";
    } else if (minPrice >= 2000 && minPrice < 3000) {
      return "₱2000 - ₱2999";
    } else if (minPrice >= 3000 && minPrice < 4000) {
      return "₱3000 - ₱3999";
    } else {
      return ">₱4000";
    }
  };

  const categorizeDormitories = (dormitories) => {
    return dormitories.map(dorm => ({
      ...dorm,
      priceCategory: categorizePriceRange(dorm.priceRange),
    }));
  };

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterSearchSnapshot = await getDocs(collection(db, 'filterSearch'));
        const filterSearchData = filterSearchSnapshot.docs.map(doc => doc.data())[0];
        setFilterSearchData(filterSearchData);

        const dormitoriesSnapshot = await getDocs(collection(db, 'dormitories'));
        const dormitoriesData = dormitoriesSnapshot.docs.map(doc => doc.data());

        const categorizedDormitories = categorizeDormitories(dormitoriesData);
        console.log("Fetched Dormitories:", dormitoriesData);
        setDormitories(categorizedDormitories);
        setFilteredDormitories(categorizedDormitories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter dormitories based on selected options
  const filterDormitories = () => {
    let results = dormitories;

    results = results.filter(dorm => {
      // Check location
      if (filterOptions.location) {
        const locationWords = filterOptions.location.toLowerCase().split(' ');
        const dormAddress = dorm.dormAddress.toLowerCase();
        if (!locationWords.some(word => dormAddress.includes(word))) {
          return false;
        }
      }
  
      // Check dorm type
      if (filterOptions.dormType) {
        if (dorm.type.toLowerCase() !== filterOptions.dormType.toLowerCase()) {
          return false;
        }
      }

      if (Object.keys(filterOptions.amenities).length > 0) {
        const selectedAmenities = Object.keys(filterOptions.amenities).filter(
          amenity => filterOptions.amenities[amenity]
        );
        if (!selectedAmenities.every(amenity => dorm.amenities.includes(amenity))) {
          return false;
        }
      }

    if (filterOptions.priceRange) {
      if (dorm.priceCategory !== filterOptions.priceRange) {
        return false;
      }
    }

    return true;
  });
    console.log("Filtered Dormitories:", results);
    setFilteredDormitories(results);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
    filterDormitories();
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
          onSelect={(value) => setFilterOptions(prev => ({ ...prev, location: value }))} // set only the selected option
        />
        <Dropdown
          text="Type:"
          options={filterSearchData.type || []}
          onSelect={(value) => setFilterOptions(prev => ({ ...prev, dormType: value }))}
        />
        <Dropdown
          text="Price Range:"
          options={["<₱1000", "₱1000 - ₱1999", "₱2000 - ₱2999", "₱3000 - ₱3999", ">₱4000"]}
          onSelect={(value) => setFilterOptions(prev => ({ ...prev, priceRange: value }))}
        />
        <CheckboxGroup
          text="Amenities"
          options={filterSearchData.amenities || []}
          onChange={(value) => setFilterOptions(prev => ({ ...prev, amenities: value }))}
        />
     

      <button onClick={handleSearchClick}>Search Dormitories</button>
      </div>
        </div> 
        {/* Right Side - Image */}
        <div className="find-dormitory-container">
          <img id='dormImage' src={dormimage} alt="Dormitory"/>
        </div>
      </div>
      
      {loading ? (
        <p>Loading dormitories...</p>
      ) : searchClicked && (
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
}

export default MainPage;
