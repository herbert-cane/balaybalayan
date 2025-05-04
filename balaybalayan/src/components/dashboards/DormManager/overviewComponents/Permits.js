import React, { useState, useEffect } from 'react';

const Permits = ({ dormitoryId }) => {
  const [permits, setPermits] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const permitsPerPage = 5;

  // Sample data - replace with actual API call
  const samplePermits = [
    {
      id: 1,
      name: "John Doe",
      dateTime: "2025-05-04 14:30",
      status: "pending",
      reason: "Weekend home visit"
    },
    {
      id: 2,
      name: "Jane Smith",
      dateTime: "2025-05-04 15:00",
      status: "approved",
      reason: "Family event"
    },
    {
      id: 3,
      name: "Mike Johnson",
      dateTime: "2025-05-04 16:15",
      status: "pending",
      reason: "Doctor's appointment"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      dateTime: "2025-05-04 17:00",
      status: "approved",
      reason: "Personal errand"
    },
    {
      id: 5,
      name: "Alex Brown",
      dateTime: "2025-05-04 17:30",
      status: "pending",
      reason: "Family gathering"
    },
    {
      id: 6,
      name: "Emily Davis",
      dateTime: "2025-05-04 18:00",
      status: "returned",
      reason: "Shopping for supplies"
    },
    {
      id: 7,
      name: "Chris Miller",
      dateTime: "2025-05-04 18:30",
      status: "pending",
      reason: "Meeting with friends"
    },
    {
      id: 8,
      name: "Lisa Garcia",
      dateTime: "2025-05-04 19:00",
      status: "approved",
      reason: "Dinner with family"
    }
  ];

  useEffect(() => {
    // TODO: Replace with actual API call to fetch permits
    setPermits(samplePermits);
  }, [dormitoryId]);

  const getCurrentDatePermits = () => {
    const today = new Date().toISOString().split('T')[0];
    return permits.filter(permit => permit.dateTime.startsWith(today));
  };

  const currentPermits = getCurrentDatePermits();
  const pageCount = Math.ceil(currentPermits.length / permitsPerPage);
  const currentPagePermits = currentPermits.slice(
    currentPage * permitsPerPage,
    (currentPage + 1) * permitsPerPage
  );

  return (
    <div>
      <h2>Permits</h2>
      <div className="permits-list">
        {currentPagePermits.map(permit => (
          <div key={permit.id} className="permit-item">
            <div className="permit-header">
              <span className="permit-name">{permit.name}</span>
              <span className="permit-datetime">{permit.dateTime}</span>
            </div>
            <div>{permit.reason}</div>
            <span className={`permit-status status-${permit.status}`}>
              {permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="permits-pagination">
          <div className="pagination-buttons">
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === pageCount - 1}
            >
              Next
            </button>
          </div>
          <span className="page-indicator">
            Page {currentPage + 1} of {pageCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default Permits;
