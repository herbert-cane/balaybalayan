import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Firebase config
import { collection, addDoc, onSnapshot, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../../AuthContext';

import './Rooms.css';

const Rooms = () => {
  const { dormitoryId } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [dormers, setDormers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    maxOccupants: 1,
    price: 0,
    size: 'Single Bed',
    amenities: '',
    status: 'Available',
  });

  // Fetch rooms
  useEffect(() => {
    if (!dormitoryId) return;

    const roomsRef = collection(db, `dormitories/${dormitoryId}/rooms`);

    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      setRooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return unsubscribe;
  }, [dormitoryId]);

  // Fetch dormers
  useEffect(() => {
    const fetchDormers = async () => {
      if (!dormitoryId) return;
      const dormersQuery = query(
        collection(db, 'users'),
        where('dormitoryId', '==', dormitoryId),
        where('role', '==', 'dormer')
      );

      const snapshot = await getDocs(dormersQuery);
      setDormers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchDormers();
  }, [dormitoryId]);

  // Add a new room
  const addRoom = async () => {
    const roomID = `Room-${rooms.length + 1}`;

    if (!newRoom.price || newRoom.price < 0 || newRoom.price > 15000) {
      alert('Price must be between 0 and 15,000.');
      return;
    }

    if (!newRoom.maxOccupants || newRoom.maxOccupants < 1 || newRoom.maxOccupants > 6) {
      alert('Max occupants must be between 1 and 6.');
      return;
    }

    try {
      const roomsRef = collection(db, `dormitories/${dormitoryId}/rooms`);
      await addDoc(roomsRef, {
        roomID,
        ...newRoom,
        maxOccupants: parseInt(newRoom.maxOccupants, 10),
      });

      setNewRoom({ maxOccupants: 1, price: 0, size: 'Single Bed', amenities: '', status: 'Available' });
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  // Toggle room availability
  const toggleAvailability = async (roomID, currentStatus) => {
    try {
      const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
      await updateDoc(roomRef, { status: currentStatus === 'Available' ? 'Occupied' : 'Available' });
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const addDormerToRoom = async (roomID, dormerId) => {
    // Check if the dormer is already assigned to any other room
    const existingRoom = rooms.find((r) => r.dormers?.includes(dormerId));
    if (existingRoom) {
      alert('Dormer is already assigned to another room.');
      return;
    }
  
    // Find the room to add the dormer to
    const room = rooms.find((r) => r.id === roomID);
    if (room && room.dormers?.length >= room.maxOccupants) {
      alert('Cannot add more dormers. Max capacity reached.');
      return;
    }
  
    try {
      // Add the dormer to the room
      const updatedDormers = [...(room.dormers || []), dormerId];
      const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
      await updateDoc(roomRef, { dormers: updatedDormers });
  
      // Update the local state to reflect the changes
      setRooms((prevRooms) =>
        prevRooms.map((r) => (r.id === roomID ? { ...r, dormers: updatedDormers } : r))
      );
    } catch (error) {
      console.error('Error adding dormer:', error);
    }
  };
  
  const removeDormerFromRoom = async (roomID, dormerId) => {
    // Find the room and check if the dormer is in it
    const room = rooms.find((r) => r.id === roomID);
    if (!room || !room.dormers?.includes(dormerId)) {
      alert('Dormer not found in this room.');
      return;
    }
  
    try {
      // Remove the dormer from the room
      const updatedDormers = room.dormers.filter((id) => id !== dormerId);
      const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
      await updateDoc(roomRef, { dormers: updatedDormers });
  
      // Update the local state to reflect the changes
      setRooms((prevRooms) =>
        prevRooms.map((r) => (r.id === roomID ? { ...r, dormers: updatedDormers } : r))
      );
    } catch (error) {
      console.error('Error removing dormer:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="rooms-container">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h3>{room.name}</h3>
              <p>Status: {room.status}</p>
              <p>Max Occupants: {room.maxOccupants}</p>
              <p>Price: {room.price}</p>
              <p>Size: {room.size}</p>
              <p>Amenities: {room.amenities}</p>
              <p>Current Dormers:</p>
              <ul>
                {room.dormers?.map((dormerId) => {
                  const dormer = dormers.find((d) => d.id === dormerId);
                  return dormer ? (
                    <li key={dormerId}>
                      {dormer.firstName} {dormer.lastName}
                      <button className ="remove-button" onClick={() => removeDormerFromRoom(room.id, dormerId)}>Remove</button>
                    </li>
                  ) : null;
                })}
              </ul>
              <label>Add Dormer: </label>
              <select
                onChange={(e) => {
                  addDormerToRoom(room.id, e.target.value);
                  e.target.value = ''; // Reset dropdown
                }}
              >
                <option value="">Select Dormer</option>
                {dormers
                  .filter((d) => !room.dormers?.includes(d.id)) // Exclude already added dormers
                  .map((dormer) => (
                    <option key={dormer.id} value={dormer.id}>
                      {dormer.firstName} {dormer.lastName}
                    </option>
                  ))}
              </select>
              <button onClick={() => toggleAvailability(room.id, room.status)}>
                {room.status === 'Available' ? 'Mark as Occupied' : 'Mark as Available'}
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="add-room-form">
        <h3>Add New Room</h3>

        <div className="input-group">
          <label>
            Room Name:
            <input
              type="text"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            />
          </label>

          <label>
            Max Occupants:
            <input
              type="number"
              min="1"
              max="6"
              value={newRoom.maxOccupants}
              onChange={(e) => setNewRoom({ ...newRoom, maxOccupants: e.target.value })}
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              min="0"
              max="15000"
              value={newRoom.price}
              onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Size:
            <select
              value={newRoom.size}
              onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
            >
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
            </select>
          </label>

          <label>
            Amenities:
            <input
              type="text"
              value={newRoom.amenities}
              onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
            />
          </label>
        </div>

        <button onClick={addRoom}>Add Room</button>
      </div>
    </div>
  );
};

export default Rooms; 