import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import './MyDormers.css';
import SearchBar from './SearchBar';

const MyDormers = ({ dormitoryId }) => {
  const [dormers, setDormers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDormers, setFilteredDormers] = useState([]);

  // Fetch all rooms in the dormitory with real-time updates
  useEffect(() => {
    if (!dormitoryId) return;

    const roomsCollection = collection(db, `dormitories/${dormitoryId}/rooms`);
    const unsubscribe = onSnapshot(roomsCollection, (snapshot) => {
      const roomList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomList);
    });

    return unsubscribe; // Cleanup listener on component unmount
  }, [dormitoryId]);

  // Fetch all dormers for the current dormitory
  useEffect(() => {
    if (!dormitoryId) return;

    const dormersQuery = query(
      collection(db, 'users'), // Assuming dormers are stored in the 'users' collection
      where('dormitoryId', '==', dormitoryId),
      where('role', '==', 'dormer')
    );

    const unsubscribe = onSnapshot(dormersQuery, (snapshot) => {
      const dormerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDormers(dormerList);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener on component unmount
  }, [dormitoryId]);

  // Add search functionality
  // useEffect(() => {
  //   const results = dormers.filter(dormer => 
  //     dormer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     dormer.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredDormers(results);
  // }, [searchTerm, dormers]);

  // const handleSearch = () => {
  //   const results = dormers.filter(dormer => 
  //     dormer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     dormer.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredDormers(results);
  // };

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  // // Find the room assignment for a given dormer
  // const findRoomForDormer = (id) => {
  //   const room = rooms.find((room) => room.dormers?.includes(id));
  //   return room ? room.name : 'Unassigned';
  // };

  useEffect(() => {
    const results = dormers.filter((dormer) =>
      `${dormer.firstName} ${dormer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDormers(results);
  }, [searchTerm, dormers]);

  const findRoomForDormer = (id) => {
    const room = rooms.find((room) => room.dormers?.includes(id));
    return room ? room.name : 'Unassigned';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dormers-section">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="dormers-container">
        <div className="dormer-cards">
          {filteredDormers.map((dormer) => (
            <div key={dormer.id} className="dormer-card">
              <img
                src={dormer.profilePhotoURL || 'https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2FdormerCardPhoto.jpg?alt=media&token=36b74a12-5fe6-4683-b4cb-9ec73be449e0'} // Fallback to a default profile image
                alt={`${dormer.firstName} ${dormer.lastName}`}
                className="dormer-image"
              />
              <div className="dormer-details">
                <h3>{`${dormer.firstName} ${dormer.lastName}`}</h3>
                <p>
                  <strong>Room:</strong> {findRoomForDormer(dormer.id)}
                </p>
                <p>
                  <strong>Status:</strong> {dormer.status || 'Active'}
                </p>
              </div>
            </div>
          ))}
          {filteredDormers.length === 0 && (
            <div className="no-results">No dormers found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDormers;