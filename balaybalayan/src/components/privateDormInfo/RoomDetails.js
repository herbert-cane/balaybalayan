import React from "react";
import Carousel from "react-bootstrap/Carousel";

const RoomDetails = ({ room, dormData }) => {
  if (!room) {
    return <p>Please select a room to view its details.</p>;
  }

  return (
    <div className="container-21">
      {/* Carousel Section */}
      <div className="c2-column-11">
        <Carousel fade>
          {room.roomPhoto.map((photoUrl, photoIndex) => (
            <Carousel.Item key={photoIndex}>
              <img
                className="carouselPic1"
                src={photoUrl}
                alt={`${room.name} Room ${photoIndex + 1}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Room Information Section */}
      <div className="c2-column-21">
        <div className="room-info1">
          <h3>
            {room.name} <span>₱{room.price}</span>
          </h3>
          <p>{room.maxOccupants} pax</p>
          <p>
            <span className="bold">Number of Rooms:</span> {dormData.NumberOfRooms}
          </p>
          <p>
            <span className="bold">Available:</span> {dormData.AvailableRooms}
          </p>
          {/* Room Amenities */}
          <h4>Room Amenities</h4>
          <ul className="amenities-list1">
            {room.roomAmenities &&
              room.roomAmenities.map((amenity, amenityIndex) => (
                <li key={amenityIndex}>
                  <input type="checkbox" checked readOnly /> {amenity}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
