import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import Carousel from 'react-bootstrap/Carousel';
import './DormPage.css';

const DormPage = () => {
  const { id } = useParams();
  const [dormData, setDormData] = useState(null);
  const [manager, setManager] = useState(null);

  // Fetch Dorm Data
  useEffect(() => {
    const fetchDormData = async () => {
      const dormRef = doc(db, "dormitories", id);
      try {
        const docSnap = await getDoc(dormRef);
        if (docSnap.exists()) {
          setDormData(docSnap.data());
        } else {
          console.error("No such dorm found!");
        }
      } catch (error) {
        console.error("Error fetching dorm data:", error);
      }
    };

    fetchDormData();
  }, [id]);

  // Fetch Manager Data
  const fetchManager = async (dormName) => {
    const managerRef = collection(db, "users");
    const q = query(managerRef, where("role", "==", "manager"), where("dormName", "==", dormName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const managerData = querySnapshot.docs[0].data();
      setManager(managerData);
    } else {
      console.log("Manager not found");
    }
  };

  useEffect(() => {
    if (dormData) {
      fetchManager(dormData.dormName); // Fetch manager info when dorm data is available
    }
  }, [dormData]);

  if (!dormData || !manager) return <div>Loading...</div>;

  return (
    <div className="body-1">
      <br /><br />
      <div className="dorm-selection-1">
        <h1>{dormData.type} Dormitory</h1>
      </div>
      <br />
      <div className="dorm-pic-1">
        <img src={dormData.banner} alt={`${dormData.dormName} Banner`} />
      </div>
      <div className="container-11">
        <div className="c1-row-1">
          <div className="c1-column-11">
            <h2 id="dormName-1"> {dormData.dormName}</h2>
            <p>{dormData.dormAddress}</p>
            <p>{dormData.priceRange} | {dormData.isVisitors ? "Allow Visitors" : "No Visitors"} | Curfew: {dormData.curfew}</p>
            <hr />
            <h3><strong>Common Amenities</strong></h3>
            <div className="amenities-container-1">
              {dormData.amenities.map((amenity, index) => (
                <div key={index} className="amenity-card1">
                  {amenity}
                </div>
              ))}
            </div>
            <hr></hr>
          </div>
          <div className="c1-column-21">
            <img id="dorm-picture-1" src={dormData.dormLogo} alt={`${dormData.dormName} Logo`} />
          </div>
        </div>
        <hr />
      </div>
      <div className="container-21">
        <div className="c2-column-11">
          <Carousel fade>
            {dormData.rooms.map((room, index) => (
              room.roomPhoto.map((photoUrl, photoIndex) => (
                <Carousel.Item key={`${index}-${photoIndex}`}>
                  <img
                    className="carouselPic1"
                    src={photoUrl}
                    alt={`${room.name} Room ${photoIndex + 1}`}
                  />
                </Carousel.Item>
              ))
            ))}
          </Carousel>
        </div>

        <div className="c2-column-21">
          {dormData.rooms.map((room, index) => (
            <div className="room-info1" key={index}>
              <h3>
                {room.name} <span>₱{room.price}</span>
              </h3>
              <p>{room.maxOccupants} pax</p>
              <p><span className="bold">Number of Rooms:</span> {dormData.NumberOfRooms}</p>
              <p><span className="bold">Available:</span> {dormData.AvailableRooms}</p>
              {/* Room Amenities */}
              <h4>Room Amenities</h4>
              <ul className="amenities-list1">
                {room.roomAmenities && room.roomAmenities.map((amenity, amenityIndex) => (
                  <li key={amenityIndex}>
                    <input type="checkbox" checked readOnly /> {amenity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="c3-column-21">
        <div className='manager-container-1'>
        <h3>Manager Information</h3>
        {manager && (
          <div className="manager-info-1">
            <div className="profile-photo-container-1">
              <img
                src={manager.profilePhotoURL}
                alt={`${manager.firstName} ${manager.lastName}`}
                className="profile-photo-1"
              />
            </div>
            <h4>{manager.firstName} {manager.lastName}</h4>
            <p>Email: {manager.email}</p>
            <p>Phone: {manager.phoneNumber}</p>
          </div>
        )}
      </div>
      </div>
      <div className='footer-1'>
      </div>
    </div>
  );
};

export default DormPage;
