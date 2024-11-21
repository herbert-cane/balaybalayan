import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firebase database
import { collection, getDocs } from 'firebase/firestore'; 
import './explorePage.css';

function ExplorePage() {
  const [dorms, setDorms] = useState([]); // State for storing dormitory data
  const [filteredDorms, setFilteredDorms] = useState([]); // State for storing filtered dormitory data
  const [loading, setLoading] = useState(true); // Loading state
  const [filter, setFilter] = useState('all'); // Filter state (default: 'all')

  // Fetch dormitories from Firestore
  useEffect(() => {
    const fetchDorms = async () => {
      const dormsCollection = collection(db, "dormitories"); // Reference to "dorms" collection in Firestore
      try {
        const querySnapshot = await getDocs(dormsCollection);
        const dormsData = querySnapshot.docs.map(doc => doc.data()); // Extract data from Firestore
        setDorms(dormsData); // Update state with dormitory data
        setFilteredDorms(dormsData); // Set initial filtered dorms to all dorms
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching dormitories: ", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchDorms();
  }, []); // Empty dependency array to run only once on component mount

  // Filter dormitories based on selected type
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    if (filterType === 'university') {
      setFilteredDorms(dorms.filter(dorm => dorm.type === 'university')); // Use 'type' for filtering
    } else if (filterType === 'private') {
      setFilteredDorms(dorms.filter(dorm => dorm.type === 'private')); // Use 'type' for filtering
    } else {
      setFilteredDorms(dorms); // Show all dorms
    }
  };

  // Explore all dorms (University and Private categories)
  const exploreAll = () => {
    // Filter dorms by type (if needed) and set them
    if (filter === 'university') {
      setFilteredDorms(dorms.filter(dorm => dorm.type === 'university'));
    } else if (filter === 'private') {
      setFilteredDorms(dorms.filter(dorm => dorm.type === 'private'));
    } else {
      setFilteredDorms(dorms); // Show all dorms
    }
  };

  useEffect(() => {
    exploreAll(); // Call exploreAll when the filter changes
  }, [filter, dorms]); // Dependencies are the filter and dorms

  return (
    <div className="explore-page">
      {/* Header Section */}
      <div className="explore-header">
        <h1>Explore Dormitories</h1>
        <p>Welcome to the Explore Page! Browse through all available dormitories below.</p>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          onClick={() => handleFilterChange('all')} 
          className={filter === 'all' ? 'active' : ''}
        >
          View All
        </button>
        <button 
          onClick={() => handleFilterChange('university')} 
          className={filter === 'university' ? 'active' : ''}
        >
          University
        </button>
        <button 
          onClick={() => handleFilterChange('private')} 
          className={filter === 'private' ? 'active' : ''}
        >
          Private
        </button>
      </div>

      {/* Dorm Cards Section */}
      <div className="dorm-list">
        {/* Show loading message while fetching dorms */}
        {loading && <p>Loading dormitories...</p>}

        {/* Display dorm names in cards */}
        {!loading && filteredDorms.length === 0 && <p>No dormitories found.</p>}

        {/* Map through filtered dorms to display each dorm name inside a card */}
        {!loading &&
          filteredDorms.map((dorm, index) => (
            <div key={index} className="explore-dorm-card">
              <div className="dorm-photo">
                <img src={dorm.dormPhoto} alt={dorm.dormName} className="dorm-image" />
              </div>
              <div className="dorm-info">
                <h3 className="dorm-name">{dorm.dormName}</h3>
                <p className="dorm-address">{dorm.dormAddress}</p>
                <p className="dorm-price">{dorm.priceRange}</p>
              </div>
              <button className="view-button">View</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ExplorePage;
