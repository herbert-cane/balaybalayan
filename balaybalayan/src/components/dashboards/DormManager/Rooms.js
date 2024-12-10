import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Firebase config
import { collection, setDoc, onSnapshot, updateDoc, doc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
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
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch rooms
  useEffect(() => {
    if (!dormitoryId) return;
  
    const roomsRef = collection(db, `dormitories/${dormitoryId}/rooms`);
    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      const sortedRooms = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          // Extracting numeric part from room names, assuming names like "Room 1", "Room 2", etc.
          const numA = parseInt(a.name.replace(/\D/g, '')); // Remove non-numeric characters and convert to number
          const numB = parseInt(b.name.replace(/\D/g, '')); // Same for room b
          
          return numA - numB; // Sort numerically
        });
  
      setRooms(sortedRooms);
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
    if (!dormitoryId) {
      console.error("Dormitory ID is undefined. Cannot add room.");
      return;
    }
  
    // Create a custom roomID based on the room name
    const customRoomID = newRoom.name.trim().toLowerCase().replace(/\s+/g, '');
  
    if (!newRoom.price || newRoom.price < 0 || newRoom.price > 15000) {
      alert('Price must be between 0 and 15,000.');
      return;
    }
  
    if (!newRoom.maxOccupants || newRoom.maxOccupants < 1 || newRoom.maxOccupants > 6) {
      alert('Max occupants must be between 1 and 6.');
      return;
    }
  
    try {
      const roomsRef = doc(db, `dormitories/${dormitoryId}/rooms`, customRoomID); // Use custom roomID
      await setDoc(roomsRef, {
        roomID: customRoomID,
        ...newRoom,
        maxOccupants: parseInt(newRoom.maxOccupants, 10),
      });
  
      setNewRoom({ maxOccupants: 1, price: 0, size: 'Single Bed', amenities: '', status: 'Available' });
      setSuccessMessage('Room added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };  
  
  // Delete a room
  const deleteRoom = async (roomID) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
        await deleteDoc(roomRef);
        setRooms(rooms.filter(room => room.id !== roomID)); // Remove room from local state
      } catch (error) {
        console.error('Error deleting room:', error);
      }
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
    const room = rooms.find((r) => r.id === roomID);
    if (!room) {
      alert('Room not found.');
      return;
    }
  
    const existingRoom = rooms.find((r) => r.dormers?.includes(dormerId));
    if (existingRoom) {
      alert('Dormer is already assigned to another room.');
      return;
    }
  
    if (room.dormers?.length >= room.maxOccupants) {
      alert('Cannot add more dormers. Max capacity reached.');
      // Update status to 'Occupied' if max occupants are reached
      try {
        const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
        await updateDoc(roomRef, { status: 'Occupied' });
        setRooms((prevRooms) =>
          prevRooms.map((r) => (r.id === roomID ? { ...r, status: 'Occupied' } : r))
        );
      } catch (error) {
        console.error('Error updating room status:', error);
      }
      return;
    }
  
    try {
      const updatedDormers = [...(room.dormers || []), dormerId];
      const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
      await updateDoc(roomRef, { dormers: updatedDormers });
  
      // Check if the room is now full and update its status
      if (updatedDormers.length >= room.maxOccupants) {
        await updateDoc(roomRef, { status: 'Occupied' });
        setRooms((prevRooms) =>
          prevRooms.map((r) => (r.id === roomID ? { ...r, dormers: updatedDormers, status: 'Occupied' } : r))
        );
      } else {
        setRooms((prevRooms) =>
          prevRooms.map((r) => (r.id === roomID ? { ...r, dormers: updatedDormers } : r))
        );
      }
    } catch (error) {
      console.error('Error adding dormer:', error);
    }
  };  
  
  const removeDormerFromRoom = async (roomID, dormerId) => {
    const room = rooms.find((r) => r.id === roomID);
    if (!room || !room.dormers?.includes(dormerId)) {
      alert('Dormer not found in this room.');
      return;
    }
  
    try {
      const updatedDormers = room.dormers.filter((id) => id !== dormerId);
      const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
      await updateDoc(roomRef, { dormers: updatedDormers });
  
      // If there are vacancies, update the room status to 'Available'
      if (updatedDormers.length < room.maxOccupants) {
        await updateDoc(roomRef, { status: 'Available' });
        setRooms((prevRooms) =>
          prevRooms.map((r) => (r.id === roomID ? { ...r, dormers: updatedDormers, status: 'Available' } : r))
        );
      } else {
        setRooms((prevRooms) =>
          prevRooms.map((r) => (r.id === roomID ? { ...r, dormers: updatedDormers } : r))
        );
      }
    } catch (error) {
      console.error('Error removing dormer:', error);
    }
  };  

  return (
    <div>
      {loading ? (
        <div className="loading-spinner">Loading...</div> // You can use a spinner or skeleton loader here
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
                      <button className="remove-button" onClick={() => removeDormerFromRoom(room.id, dormerId)}>Remove</button>
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
              <button onClick={() => deleteRoom(room.id)}>Delete Room</button>
            </div>
          ))}
        </div>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}
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
