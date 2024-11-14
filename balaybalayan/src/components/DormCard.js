import React from 'react';
import './DormCard.css';

const DormCard = ({ image, type, name, address, priceRange }) => {
  return (
    <div className="dorm-card">
      {/* Image section */}
      <div className="image-container">
        <img src={image} alt={name} className="dorm-image" />
      </div>

      {/* Details section */}
      <div className="details">
        <div className="header">
          <img
            src={type === 'University' ? '/path/to/university-logo.png' : '/path/to/private-logo.png'}
            alt={type}
            className="type-logo"
          />
          <span className="dorm-name">{name}</span>
        </div>
        <p className="address">{address}</p>
        <p className="price-range">{priceRange}</p>
        
        {/* Button */}
        <button className="view-details">View Details</button>
      </div>
    </div>
  );
};

export default DormCard;
