import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

const BalayCawayan = () => {
  const [dormData, setDormData] = useState(null);
  const [roomsData, setRoomsData] = useState([]);
  const [managerData, setManagerData] = useState(null);
  const dormID = "balaycawayan";

  useEffect(() => {
    const fetchDormData = async () => {
      const docRef = doc(db, "dorms", dormID);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDormData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    const fetchRoomsData = async () => {
      const roomsRef = collection(db, "dorms", dormID, "rooms");
      try {
        const querySnapshot = await getDocs(roomsRef);
        const rooms = querySnapshot.docs.map(doc => doc.data());
        setRoomsData(rooms);
      } catch (error) {
        console.error("Error getting rooms:", error);
      }
    };

    const fetchManagerData = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("role", "==", "manager"), where("dormName", "==", dormID));
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setManagerData(doc.data());
        });
      } catch (error) {
        console.error("Error getting manager data:", error);
      }
    };

    fetchDormData(); 
    fetchRoomsData();
    fetchManagerData(); 

  }, [dormID]); 
 
  if (!dormData || roomsData.length === 0 || !managerData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{dormData.dormName}</h2>
      <p><strong>Amenities:</strong> {dormData?.amenities ? dormData.amenities.join(', ') : 'None'}</p>

      <p><strong>Rooms:</strong></p>
      {roomsData.map((room, index) => (
        <div key={index}>
          <h3>{room.roomName}</h3>
          <p><strong>Price:</strong> {room.roomPrice}</p>
          <p><strong>Availability:</strong> {room.isAvailable ? 'Available' : 'Occupied'}</p>

          <h4>Amenities:</h4>
          <ul>
            {room.roomAmenities && room.roomAmenities.map((amenity, amenityIndex) => (
              <li key={amenityIndex}>{amenity}</li>
            ))}
          </ul>
        </div>
      ))}

    <div>
        <h3>Manager Information</h3>
        <p><strong>Name:</strong> {managerData.firstName} {managerData.lastName}</p>
        <p><strong>Email:</strong> {managerData.email}</p>
        <p><strong>Phone Number:</strong> {managerData.phoneNumber}</p>
        <p><strong>Sex:</strong> {managerData.sex}</p>
        <img src={managerData.profilePhotoURL} alt="Manager's Profile" style={{ width: '100px'}} />
      </div>

    </div>
  );
};

export default BalayCawayan;
