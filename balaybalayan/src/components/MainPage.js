import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import banner from './photos/banner.png'; 
import DormCarousel from './DormCarousel.js';
import './main.css';

const Dropdown = ({ text, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    onSelect(e.target.value);
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

const DormFilterButtons = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);

  const toggleButton = (button) => {
    setActiveButton((prev) => (prev === button ? null : button));
    if (button === 'viewAll') {
      navigate('/Explore');
    }
  };

  return (
    <div className="dorm-filter-buttons">
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

  const parsePriceRange = (priceRangeStr) => {
    const range = priceRangeStr.split('-').map(price =>
      parseInt(price.replace('₱', '').replace(',', '').trim())
    );
    return range.length === 1 ? [range[0], range[0]] : range;
  };

  const categorizePriceRange = useCallback((priceRange) => {
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
  }, []);

  const categorizeDormitories = useCallback((dormitories) => {
    return dormitories.map(dorm => ({
      ...dorm,
      priceCategory: categorizePriceRange(dorm.priceRange),
    }));
  }, [categorizePriceRange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterSearchSnapshot = await getDocs(collection(db, 'filterSearch'));
        const filterSearchData = filterSearchSnapshot.docs.map(doc => doc.data())[0];
        setFilterSearchData(filterSearchData);

        const dormitoriesSnapshot = await getDocs(collection(db, 'dormitories'));
        const dormitoriesData = dormitoriesSnapshot.docs.map(doc => doc.data());

        const categorizedDormitories = categorizeDormitories(dormitoriesData);
        setDormitories(categorizedDormitories);
        setFilteredDormitories(categorizedDormitories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [categorizeDormitories]);

  const filterDormitories = () => {
    let results = [...dormitories];

    if (filterOptions.location) {
      results = results.filter(dorm => dorm.dormAddress.toLowerCase().includes(filterOptions.location.toLowerCase()));
    }
    if (filterOptions.dormType) {
      results = results.filter(dorm => dorm.type.toLowerCase() === filterOptions.dormType.toLowerCase());
    }
    if (Object.keys(filterOptions.amenities).length > 0) {
      const selectedAmenities = Object.keys(filterOptions.amenities).filter(amenity => filterOptions.amenities[amenity]);
      results = results.filter(dorm => selectedAmenities.every(amenity => dorm.amenities.includes(amenity)));
    }
    if (filterOptions.priceRange) {
      results = results.filter(dorm => dorm.priceCategory === filterOptions.priceRange);
    }

    setFilteredDormitories(results);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
    filterDormitories();
  };

  return (
    <div>
      <img id="banner" src={banner} alt="Banner" />
      <div className="ex-do">
        <h2>Explore Dormitories</h2>
        <DormFilterButtons />
      </div>
      <DormCarousel />
      <div className="filter-dorm">
        <div className="find-dormitory-container">
          <div className="find-dormitory-card">
            <h2 className="card-title">Find Dormitory</h2>
            <Dropdown
              text="Location:"
              options={filterSearchData.locations || []}
              onSelect={(value) => setFilterOptions(prev => ({ ...prev, location: value }))}
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
      </div>
      {loading ? (
        <p>Loading dormitories...</p>
      ) : searchClicked && (
        filteredDormitories.length > 0 ? (
          <div>
            <h2>Matched Dormitories</h2>
            <div className="result-search-row">
              {filteredDormitories.map((dorm, index) => (
                <div key={index} className="result-search">
                  <h4>{dorm.dormName}</h4>
                  <h6>Type: {dorm.type}</h6>
                  <h6>Address: {dorm.dormAddress}</h6>
                  <h6>Price: {dorm.priceRange}</h6>
                  <button onClick={() => navigate(dorm.path)}>Check Dormitory</button>
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