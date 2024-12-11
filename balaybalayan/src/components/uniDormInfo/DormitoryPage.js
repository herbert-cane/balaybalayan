import React, { useEffect, useState } from "react";
import { db } from '../../firebase';
import { useParams } from "react-router-dom";  // useParams for respective id URL of dormitories
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
//import {doc, getDoc} from 'firebase/firestore';

// carousel pictures and import
import example1 from './photos/unknown.png';
import example2 from './photos/unknown2.jpg';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

import './uniDorm.css';

const DormitoryPage = () => {
  const { id } = useParams(); // Get the id from the URL
  const [dormData, setDormData] = useState(null); // initial state is null
  const [basicRoom, setBasicRoom] = useState(null); // State for Basic Room data
  const [appliances, setAppliances] = useState({ applianceName: [], applianceFee: [] }); // State for appliances
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [manager, setManagerData] = useState(null);

  useEffect(() => {
    const fetchDormitory = async () => {
      try {
        const dormRef = doc(db, "dormitories", id); // Get the specific dorm by ID
        const dormSnapshot = await getDoc(dormRef); // Fetch the document
        if (dormSnapshot.exists()) {
          const data = dormSnapshot.data();
          const { rooms, ...dormWithoutRooms } = data;
          setDormData(dormWithoutRooms); // Set the dorm data without rooms

          // Find the Basic Room from the rooms array
          const basicRoomData = rooms.find(room => room.roomName === "Basic Room");
          setBasicRoom(basicRoomData); // Set the Basic Room data

          if (data.appliances) {
            setAppliances({
              applianceName: data.appliances[0]?.applianceName || [],
              applianceFee: data.appliances[1]?.applianceFee || [],
            });
          }
          
        } else {
          console.log("Dormitory not found!");
        }
      } catch (error) {
        console.error("Error fetching dormitory data: ", error);
      }
    };
    const fetchManagerData = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("role", "==", "manager"), where("dormName", "==", id));
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setManagerData(doc.data());
        });
      } catch (error) {
        console.error("Error getting manager data:", error);
      }
    }; 

    fetchDormitory(); 
    fetchManagerData(); 
  }, [id]); // Re-run the effect if the dormitory ID changes

  if (!dormData || !basicRoom  /*|| !managerData */) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="body1">
      <br/><br/>
      <div className="dorm-selection1">
        <h1>{dormData.type} Dormitory</h1>
      </div>
      <br/>
      <div className="dorm-pic1">
        <img id="dorm-banner1" src={dormData.banner} alt={`${dormData.dormName} Banner`} />
      </div>
      <div className="container11">
        <div className="c1-row1">
          <div className="c1-column11">
            <h2 id="dormName1"> {dormData.dormName}</h2>
            <p>{dormData.dormAddress}</p>
            <p>{dormData.priceRange} | {dormData.isVisitors ? "Allow Visitors" : "No Visitors"} | Curfew: {dormData.curfew}</p>
            <hr/>
            <h3><strong>Common Amenities</strong></h3>
            <div className="amenities-container1">
              {dormData.amenities.map((amenity, index) => (
                <div key={index} className="amenity-card1">
                  {amenity}
                </div>  
              ))}
            </div>
          </div>
          <div className="c1-column21">
            <img id="dorm-picture1" src= {dormData.dormLogo} alt={`${dormData.dormName} Logo`} />
          </div>
        </div>
        <hr />
      </div>
      <div className="container21">
        <div className="c1-row1">
          <div className="c2-column11">
          <Carousel fade>
              <Carousel.Item>
                <img className="carouselPic1" src={example1} alt="First slide" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="carouselPic1" src={example2} alt="Second slide" />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="c2-column21">
              <div className="room-info1">
                <h3>{basicRoom.roomName}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;₱{basicRoom.roomPrice}</h3>
                <p>{basicRoom.numPersons}</p>
                <p><strong>Number of Rooms:</strong> {dormData.NumberOfRooms}</p>
                <p><strong>Available Rooms:</strong> {dormData.AvailableRooms}</p>
                <h4>Room Amenities</h4>
                <ul className="amenities-list1">
                  {basicRoom.roomAmenities && basicRoom.roomAmenities.slice(0, showAllAmenities ? basicRoom.roomAmenities.length : 3).map((amenity, amenityIndex) => (
                    <li key={amenityIndex}>
                      <input type="checkbox" checked readOnly /> {amenity}
                    </li>
                  ))}
                </ul>
                <div className="button-div">
                  <button id='c2-button1' onClick={() => setShowAllAmenities(!showAllAmenities)}>
                    {showAllAmenities ? 'Hide Amenities' : 'Show All Amenities'}
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div className="container31">
        <hr/>
        <div className="c1-row1">
          <div className="c3-column11">
            <div className="appliance-list1">
            <h3>Appliance Fee Guide</h3>
            <br/>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <div className="appliance-box">
                    {appliances.applianceName.map((name, index) => (
                      <tr key={index}>
                        <td className="appliance-name">{name}</td>
                        <td className="appliance-fee">{appliances.applianceFee[index].toFixed(2)}</td>
                      </tr>
                    ))}
                  </div>
                </tbody>
              </table>
            </div>
          </div>
          <div className="c3-column21">
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
        <hr/>
      </div>
      <div className='container41'>
        <h2>Application Process</h2>
      </div>
      <div className='footer1'> 
      </div>
    </div>
  );
};

export default DormitoryPage;