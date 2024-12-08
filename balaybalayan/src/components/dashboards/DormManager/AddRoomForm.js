import React, { useState } from 'react';

const AddRoomForm = ({ onAddRoom }) => {
  const [newRoom, setNewRoom] = useState({
    name: '',
    maxOccupants: 1,
    price: 0,
    size: 'Single Bed',
    amenities: '',
    status: 'Available',
  });

  const [errors, setErrors] = useState({});

  const validateInput = (field, value) => {
    let error = '';
    if (field === 'price' && (value < 0 || value > 15000)) {
      error = 'Price must be between 0 and 15,000.';
    }
    if (field === 'maxOccupants' && (value < 1 || value > 6)) {
      error = 'Max occupants must be between 1 and 6.';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };

  const isFormValid = !Object.values(errors).some((error) => error) &&
                      Object.values(newRoom).every((field) => field);

  const handleSubmit = () => {
    if (isFormValid) {
      onAddRoom(newRoom);
      setNewRoom({ name: '', maxOccupants: 1, price: 0, size: 'Single Bed', amenities: '', status: 'Available' });
    }
  };

  return (
    <div className="add-room-form">
      <h3>Add New Room</h3>
      <div className="input-group">
        <label>Room Name:</label>
        <input
          type="text"
          name="name"
          value={newRoom.name}
          onChange={handleChange}
          placeholder="Enter room name"
        />
      </div>
      <div className="input-group inline">
        <label>
          Max Occupants:
          <input
            type="number"
            name="maxOccupants"
            min="1"
            max="6"
            value={newRoom.maxOccupants}
            onChange={handleChange}
          />
          {errors.maxOccupants && <div className="tooltip">{errors.maxOccupants}</div>}
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            min="0"
            max="15000"
            value={newRoom.price}
            onChange={handleChange}
          />
          {errors.price && <div className="tooltip">{errors.price}</div>}
        </label>
      </div>
      <div className="input-group">
        <label>Size:</label>
        <select name="size" value={newRoom.size} onChange={handleChange}>
          <option value="Single Bed">Single Bed</option>
          <option value="Double Bed">Double Bed</option>
        </select>
      </div>
      <div className="input-group">
        <label>Amenities:</label>
        <input
          type="text"
          name="amenities"
          value={newRoom.amenities}
          onChange={handleChange}
          placeholder="Enter amenities (e.g., AC, WiFi)"
        />
      </div>
      <div className="divider"></div>
      <button onClick={handleSubmit} disabled={!isFormValid}>
        Add Room
      </button>
    </div>
  );
};

export default AddRoomForm;