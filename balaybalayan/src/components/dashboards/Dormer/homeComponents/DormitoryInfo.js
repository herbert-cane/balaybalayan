import React from 'react';

const DormitoryInfo = ({ dormInfo }) => {
  return (
    <div className="dorm-info">
      <img
        src={dormInfo.dormPhoto || "placeholder-image.jpg"}
        alt="Dormitory"
        className="dorm-image"
      />
      <h2 className="dorm-name">{dormInfo.dormName}</h2>
      <p className="dorm-address">{dormInfo.dormAddress}</p>
      <p className="dorm-details">
        {dormInfo.priceRange} | {dormInfo.isVisitors ? "Visitors Allowed" : "No Visitors Allowed"} | Curfew: {dormInfo.curfew || "N/A"}
      </p>
    </div>
  );
};

export default DormitoryInfo;