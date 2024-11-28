import React, { useState } from "react";
import "./DormitorySelection.css";

const DormitorySelection = ({ dormitories, onSelectDormitory }) => {
  const [selectedDorm, setSelectedDorm] = useState(null);

  const handleSelection = (dormId) => {
    setSelectedDorm(dormId);
  };

  const handleConfirm = () => {
    if (selectedDorm) {
      onSelectDormitory(selectedDorm);
    } else {
      alert("Please select a dormitory before confirming.");
    }
  };

  return (
    <div className="dormitory-selection-container">
      <h3>Select Your Dormitory</h3>
      <div className="dormitory-grid">
        {dormitories.map((dorm) => (
          <div
            key={dorm.id}
            className={`dorm-box ${selectedDorm === dorm.id ? "selected" : ""}`}
            onClick={() => handleSelection(dorm.id)}
          >
            <img
              src={dorm.dormPhoto || "/path/to/fallback-image.png"}
              alt={dorm.dormName}
              className="dorm-image"
            />
            <h4>{dorm.dormName}</h4>
          </div>
        ))}
      </div>
      <button className="confirm-button" onClick={handleConfirm}>
        Confirm Selection
      </button>
    </div>
  );
};

export default DormitorySelection;