import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import './styles.css';

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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="banner-container">
        <img id="banner" src={dormData.banner} alt={`${dormData.dormName}'s Banner`} />
      </div>
      <div className="flex-container">
        <table className="dorm-info-table">
          <tbody>
            <tr>
              <td className="container">
                <h1>{dormData.dormName}</h1>
                <p>{dormData.dormAddress}</p>
                <p>
                  {dormData.priceRange} | {dormData.isVisitors ? 'Allows Visitors' : 'No Visitors'} | Curfew: {dormData.curfew}
                </p>
              </td>

              <td rowSpan="2" className="dorm-logo">
                <img className="dorm-logo" src={dormData.dormLogo} alt={`${dormData.dormName} Logo`} />
              </td>
            </tr>
            <tr className="amenities-list">
              <td className="container">
                <h2>Amenities</h2>
                <table className="amenities-table">
                  <tbody>
                    {dormData.amenities && dormData.amenities.length > 0 && dormData.amenities.map((amenity, index) => {
                      const rowIndex = Math.floor(index / 3);
                      const columnIndex = index % 3;

                      if (columnIndex === 0) {
                        return (
                          <tr key={rowIndex}>
                            <td>{amenity}</td>
                            {dormData.amenities[index + 1] ? <td>{dormData.amenities[index + 1]}</td> : <td>...</td>}
                            {dormData.amenities[index + 2] ? <td>{dormData.amenities[index + 2]}</td> : <td>...</td>}
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rooms">
        <h3>Rooms:</h3>
        {roomsData.map((room, index) => (
          <div key={index} className="room">
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
      </div>

      <table className="manager-reservation-table">
        <tbody>
          <tr className='col1'>
            <td className="manager-info-container">
              <div className="manager-info">
                <h3>Manager Information</h3>
                <img src={managerData.profilePhotoURL} alt="Manager's Profile" />
                <p><strong>{managerData.firstName} {managerData.lastName}</strong></p>
                <p className="Role">Dorm Manager</p>
                <table className="manager-info-table">
                  <tbody>
                    <tr>
                      <td><strong>Email:</strong> {managerData.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong> {managerData.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td><strong>Sex:</strong> {managerData.sex}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>

            <td className="reservation-cancellation-table">
              <table>
                <tbody>
                  <tr className='col2'>
                    <td className="reservation">Reservation</td>
                  </tr>
                  <tr>
                    <td className="cancellation">Cancellation</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BalayCawayan;
