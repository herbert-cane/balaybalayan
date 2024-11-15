import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import './uniStyle.css';
import gumamela from './photos/gumamela.png';
import balayGumamela from './photos/Balay Gumamela.png';
import example1 from './photos/c2.jpg';
import example2 from './photos/c3.jpg';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

const BalayGumamela = () => {
  const [dormData, setDormData] = useState(null);
  const [roomsData, setRoomsData] = useState([]);
  const [managerData, setManagerData] = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const dormID = "balaygumamela";

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
    <div className="body">
      <h1>Body</h1>
      <div className='dorm-selection'>
        <h1>University Dormitory</h1>
      </div>
      <div className='dorm-pic'>
        <img id="dorm-banner" src={gumamela} alt='Dorm Banner' />
      </div>

      <div className='container1'>
        <div className='c1-row'>
          <div className='c1-column1'>
            <h2>{dormData.dormName}</h2>
            <p>{dormData.dormAddress}</p>
            <p>{dormData.priceRange} | {dormData.isVisitors ? 'Allow Visitors' : 'No Visitors'} | Curfew: {dormData.curfew}</p>
            <hr/>
            <h3><strong>Common Amenities</strong></h3>
            <div className="amenities-container">
              {dormData.amenities.map((amenity, index) => (
                <div key={index} className="amenity-card">
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          <div className='c1-column2'>
            <img id='dorm-picture' src={balayGumamela} alt='Dormitory' />
          </div>
        </div>
        <hr />
      </div>

      <div className='container2'>
        <div className='c1-row'>
          <div className='c2-column1'>
            <Carousel fade>
              <Carousel.Item>
                <img className="carouselPic" src={example1} alt="First slide" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="carouselPic" src={example2} alt="Second slide" />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className='c2-column2'>
            {roomsData.map((room, index) => (
              <div key={index} className="room-info">
                <h3>{room.roomName}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;₱{room.roomPrice}</h3>
                <p>{room.numPersons}</p>
                <p><strong>Availability:</strong> {room.isAvailable ? 'Available' : 'Occupied'}</p>
                <h4>Room Amenities</h4>
                <ul className="amenities-list">
                  {room.roomAmenities && room.roomAmenities.slice(0, showAllAmenities ? room.roomAmenities.length : 6).map((amenity, amenityIndex) => (
                    <li key={amenityIndex}>
                      <input type="checkbox" checked readOnly /> {amenity}
                    </li>
                  ))}
                </ul>
                <button id='c2-button' onClick={() => setShowAllAmenities(!showAllAmenities)}>
                  {showAllAmenities ? 'Hide Amenities' : 'Show All Amenities'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='container3'>
        <hr/>
        <div className='c1-row'>
          <div className='c3-column1'>
            <div className='c3-card'></div>
          </div>
          <div className='c3-column2'>
            <br/>
            <h3>Manager Information</h3>
            <p><strong>Name:</strong> {managerData.firstName} {managerData.lastName}</p>
            <p><strong>Email:</strong> {managerData.email}</p>
            <p><strong>Phone Number:</strong> {managerData.phoneNumber}</p>
            <p><strong>Sex:</strong> {managerData.sex}</p>
          </div>
        </div>
        <hr />
      </div>

      <div className='container4'>
        <h2>Application Process</h2>
      </div>

      <div className='footer'>
        <h1>Footer</h1>
      </div>
    </div>
  );
}

export default BalayGumamela;
