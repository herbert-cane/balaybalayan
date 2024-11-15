import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from '../../firebase';  
import RoomList from './components/RoomList';
import './privateDorm.css';


const BalayCawayan = () => {
  const [dormData, setDormData] = useState(null);
  const [roomsData, setRoomsData] = useState([]);
  const [managerData, setManagerData] = useState(null);
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
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

    const fetchBanner = async () => {
      const bannerRef = ref(storage, "outside_dorm_banner/balaycawayanBanner.png"); 
      try {
        const url = await getDownloadURL(bannerRef);
        setBannerUrl(url);
      } catch (error) {
        console.error("Error fetching banner image:", error);
      }
    };

    const fetchLogo = async () => {
      const logoRef = ref(storage, "dorm_logos/balaycawayanLogo.png"); 
      try {
        const url = await getDownloadURL(logoRef);
        setLogoUrl(url);
      } catch (error) {
        console.error("Error fetching banner image:", error);
      }
    };

    fetchDormData(); 
    fetchRoomsData();
    fetchManagerData(); 
    fetchBanner();
    fetchLogo();

  }, [dormID]); 
 
  if (!dormData || roomsData.length === 0 || !managerData) {
    return <div>Loading...</div>;
  }

  return (

    <div className='main-container'>
      <div className='header'>
        <h1>Private Dorms</h1>
        </div>

        <div className='headerphoto'>
        {bannerUrl && <img src={bannerUrl} className="banner "alt="Balay Cawayan Banner"  />}
        </div>

       <div className='body'>
        <div className='top'>
          <div className="dorm-info">
            <h2>{dormData.dormName}</h2>
            <p>{dormData.dormAddress}</p>
            <p className="dorm-details">
              {dormData.priceRange} | 
              {dormData.isVisitors ? ' Allow Visitors | ' : ''} 
              Curfew: {dormData.curfew}
            </p>
            <hr></hr>

            <div className="amenities">
            <p><strong>Common Amenities:</strong> </p>
            <div className="amenities-info">
            <ul className="amenities-list">
                {dormData?.amenities && dormData.amenities.length > 0 ? (
                  dormData.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))
                ) : (
                  <li>None</li>
                )}
            </ul>
            </div>
            </div>
          </div>
          <div className="logoContainer">
            {logoUrl && <img src={logoUrl} className="logo"alt="Balay Cawayan Logo"  />}
          </div>
        </div>

        <hr></hr>
        
      <div className='room-row'>
        <p><strong>Rooms</strong></p>
        <RoomList dormID={dormID} />
      </div>
      
      <hr></hr>
      
      <div className='room-info'>
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

    <div className='manager-info'>
        <h3>Manager Information</h3>
        <p><strong>Name:</strong> {managerData.firstName} {managerData.lastName}</p>
        <p><strong>Email:</strong> {managerData.email}</p>
        <p><strong>Phone Number:</strong> {managerData.phoneNumber}</p>
        <p><strong>Sex:</strong> {managerData.sex}</p>
        <img src={managerData.profilePhotoURL} alt="Manager's Profile" style={{ width: '100px'}} />
      </div>

      </div>

    </div>
    </div>
  );
};

export default BalayCawayan;
