import React from 'react';

const RequestButton = ({ type, onClick }) => {
  return (
    <button 
      className="request-option" 
      onClick={() => onClick(type)}
    >
      {type}
    </button>
  );
};

export default RequestButton;