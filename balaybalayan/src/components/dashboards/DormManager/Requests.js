import React from 'react';

const Requests = () => {
  const requests = [
    { id: 1, type: 'Booking Request', dormerName: 'John Doe', status: 'Pending' },
    { id: 2, type: 'Room Change Request', dormerName: 'Jane Smith', status: 'Approved' },
  ];

  return (
    <div className="requests">
      <h2>Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <p>{request.type} from {request.dormerName}</p>
            <p>Status: {request.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Requests;
