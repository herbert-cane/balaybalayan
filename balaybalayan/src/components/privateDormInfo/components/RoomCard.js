import React from 'react';
import './RoomCardCSS.css';

const RoomCard = ({ roomName, roomPrice, roomImage, onCheckRoom }) => {
  return (
    <div className="room-card">
      {roomImage && <img src={roomImage} alt={`${roomName} Image`} className="room-image" />}
      
      <div className="room-details">
        <div className="room-name-price">
            <h3 className="room-name">{roomName}</h3>
            <p className="room-price">₱{roomPrice}</p>
        </div>
        <button onClick={onCheckRoom} className="check-room-btn">
          Check Room
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
