import React from 'react';

const ManagerInfo = ({ dormInfo }) => {
  return (
    <div className="manager-info">
      <div className="manager-card">
        <div className="manager-left">
          <img
            src={dormInfo.managerPhoto || "placeholder-manager.jpg"}
            alt="Dorm Manager"
            className="manager-photo"
          />
          <h3 className="manager-name">{dormInfo.managers || "Unknown Manager"}</h3>
          <p className="manager-title">Dorm Manager</p>
        </div>
        <div className="manager-right">
          <h4>Contact Information</h4>
          <p>
            <span className="icon phone-icon" /> {dormInfo.managerPhone || "N/A"}
          </p>
          <p>
            <span className="icon email-icon" /> {dormInfo.managerEmail || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerInfo;