import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import {
  collection,
  setDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { useAuth } from '../../../AuthContext';
import './Rooms.css';

const Rooms = () => {
  const { dormitoryId } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [dormers, setDormers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    name: '',
    maxOccupants: 1,
    price: 0,
    size: 'Single Bed',
    amenities: '',
    status: 'Available',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRoom, setSearchRoom] = useState('');

  // Fetch rooms
  useEffect(() => {
    if (!dormitoryId) return;

    const roomsRef = collection(db, `dormitories/${dormitoryId}/rooms`);
    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      const sortedRooms = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const numA = parseInt(a.name.replace(/\D/g, ''));
          const numB = parseInt(b.name.replace(/\D/g, ''));
          return numA - numB;
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

  const addRoom = async () => {
    if (!dormitoryId) {
      console.error("Dormitory ID is undefined. Cannot add room.");
      return;
    }

    if (!newRoom.name) {
      alert('Please enter a room name');
      return;
    }

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
      const roomsRef = doc(db, `dormitories/${dormitoryId}/rooms`, customRoomID);
      await setDoc(roomsRef, {
        roomID: customRoomID,
        ...newRoom,
        maxOccupants: parseInt(newRoom.maxOccupants, 10),
      });

      setNewRoom({ 
        name: '',
        maxOccupants: 1, 
        price: 0, 
        size: 'Single Bed', 
        amenities: '', 
        status: 'Available' 
      });
      setSuccessMessage('Room added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const deleteRoom = async (roomID) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
        await deleteDoc(roomRef);
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const toggleAvailability = async (roomID, currentStatus) => {
    try {
      const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
      await updateDoc(roomRef, { 
        status: currentStatus === 'Available' ? 'Occupied' : 'Available' 
      });
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
      try {
        const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
        await updateDoc(roomRef, { status: 'Occupied' });
      } catch (error) {
        console.error('Error updating room status:', error);
      }
      return;
    }
  
    try {
      const updatedDormers = [...(room.dormers || []), dormerId];
      const roomRef = doc(db, `dormitories/${dormitoryId}/rooms`, roomID);
      await updateDoc(roomRef, { dormers: updatedDormers });
  
      if (updatedDormers.length >= room.maxOccupants) {
        await updateDoc(roomRef, { status: 'Occupied' });
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
  
      if (updatedDormers.length < room.maxOccupants) {
        await updateDoc(roomRef, { status: 'Available' });
      }
    } catch (error) {
      console.error('Error removing dormer:', error);
    }
  };

  const filteredRooms = searchRoom 
    ? rooms.filter(room => {
        const roomNumber = room.name.replace(/\D/g, ''); // Extract only numbers
        return roomNumber === searchRoom;
      })
    : rooms;

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          Showing {indexOfFirstRoom + 1}-{Math.min(indexOfLastRoom, rooms.length)} of {rooms.length} rooms
        </div>
        <div className="pagination-controls">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &larr; Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`pagination-button ${currentPage === number ? 'active-page' : ''}`}
            >
              {number}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="rooms-page">
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="room-search">
            <label className="search-label">Search:</label>
            <input
              type="text"
              placeholder="Enter room number (e.g. 101)"
              value={searchRoom}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                setSearchRoom(value);
                setCurrentPage(1);
              }}
              className="room-search-input"
            />
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search room number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="search-input"
            />
          </div>
          {renderPagination()}
          <div className="rooms-grid">
            {currentRooms.map((room) => (
              <div key={room.id} className="room-card">
                <h3>{room.name}</h3>
                <p>Status: <span className={`status-${room.status.toLowerCase()}`}>{room.status}</span></p>
                <p>Max Occupants: {room.maxOccupants}</p>
                <p>Price: ₱{room.price.toLocaleString()}</p>
                <p>Size: {room.size}</p>
                <p>Amenities: {room.amenities}</p>
                <div className="dormers-section">
                  <p>Current Dormers:</p>
                  <ul>
                    {room.dormers?.map((dormerId) => {
                      const dormer = dormers.find((d) => d.id === dormerId);
                      return dormer ? (
                        <li key={dormerId}>
                          <span className="dormer-name">
                            {dormer.firstName} {dormer.lastName}
                          </span>
                          <button
                            className="remove-button"
                            onClick={() => removeDormerFromRoom(room.id, dormerId)}
                          >
                            Remove
                          </button>
                        </li>
                      ) : null;
                    })}
                  </ul>
                  <div className="add-dormer-control">
                    <label>Add Dormer: </label>
                    <select
                      onChange={(e) => {
                        addDormerToRoom(room.id, e.target.value);
                        e.target.value = '';
                      }}
                    >
                      <option value="">Select Dormer</option>
                      {dormers
                        .filter((d) => !room.dormers?.includes(d.id))
                        .map((dormer) => (
                          <option key={dormer.id} value={dormer.id}>
                            {dormer.firstName} {dormer.lastName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="room-actions">
                  <button 
                    className={`status-button ${room.status === 'Available' ? 'mark-occupied' : 'mark-available'}`}
                    onClick={() => toggleAvailability(room.id, room.status)}
                  >
                    {room.status === 'Available' ? 'Mark as Occupied' : 'Mark as Available'}
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => deleteRoom(room.id)}
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="add-room-form">
        <h3>Add New Room</h3>
        <div className="form-grid">
          <div className="input-group">
            <label>
              Room Name:
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                required
              />
            </label>
          </div>
          
          <div className="input-group">
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
          </div>
          
          <div className="input-group">
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
          </div>
          
          <div className="input-group">
            <label>
              Amenities:
              <input
                type="text"
                value={newRoom.amenities}
                onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
              />
            </label>
          </div>
        </div>
        <button className="submit-button" onClick={addRoom}>Add Room</button>
      </div>
    </div>
  );
};

export default Rooms;