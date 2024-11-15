import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import './dorm-manager-styles.css';
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function DormManager() {
  const [dormData, setDormData] = useState(null);
  const [roomsData, setRoomsData] = useState([]);
  const [managerData, setManagerData] = useState(null);
  const [dormID, setDormID] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState(null);

  // Firebase Auth listener to track the current user
  useEffect(() => {
    const auth = getAuth();
    
    // Set up an auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInEmail(user.email);  // Set the email of the logged-in user
      } else {
        setLoggedInEmail(null);  // Reset the email if no user is logged in
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loggedInEmail) return; // Wait until the email is fetched

    const fetchManagerData = async () => {
      try {
        const managerQuery = query(collection(db, "users"), where("email", "==", loggedInEmail));
        const managerSnapshot = await getDocs(managerQuery);

        if (!managerSnapshot.empty) {
          const managerDoc = managerSnapshot.docs[0];
          const managerData = managerDoc.data();
          setManagerData(managerData);
          setDormID(managerData.dormID);
        } else {
          console.log("No manager data found for this email.");
        }
      } catch (error) {
        console.error("Error fetching manager data:", error);
      }
    };

    fetchManagerData();
  }, [loggedInEmail]);

  useEffect(() => {
    if (!dormID) return; // Ensure dormID is set before fetching dorm data

    const fetchDormData = async () => {
      try {
        const dormDocRef = doc(db, "dormitories", dormID);
        const dormDocSnap = await getDoc(dormDocRef);
        if (dormDocSnap.exists()) {
          setDormData(dormDocSnap.data());
        }

        const roomsColRef = collection(db, "dormitories", dormID, "rooms");
        const roomsSnapshot = await getDocs(roomsColRef);
        const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRoomsData(roomsList);
      } catch (error) {
        console.error("Error fetching dorm or rooms data:", error);
      }
    };

    fetchDormData();
  }, [dormID]);

  console.log('Dorm Data:', dormData);
  console.log('Manager Data:', managerData);

  return (
    <div className="dorm-manager-container">
      <h2>Dorm Manager Dashboard</h2>
      <div className="profile-section">
        <img className="profile-photo" src={managerData?.profilePhotoURL} alt={`${managerData?.firstName} ${managerData?.lastName}`} />
        <div className="profile-details">
          <h3>{managerData?.firstName} {managerData?.lastName}</h3>
          <p><strong>Role:</strong> {managerData?.role}</p>
          <p><strong>Room Number:</strong> {managerData?.roomNumber}</p>
          <p><strong>Sex:</strong> {managerData?.sex}</p>
          <p><strong>Move-in Date:</strong> {managerData?.moveInDate}</p>
          <p><strong>Email:</strong> {managerData?.email}</p>
          <p><strong>Phone Number:</strong> {managerData?.phoneNumber}</p>
          
          {/* Ensure dormData is available before trying to access dormName */}
          {dormData ? (
            <p><strong>Dorm Name:</strong> {dormData.dormName}</p>
          ) : (
            <p><strong>Dorm Name:</strong> Loading...</p>
          )}

          <div className="emergency-contact">
            <h4>Emergency Contact</h4>
            <p><strong>Name:</strong> {managerData?.emergencyContact?.name}</p>
            <p><strong>Relationship:</strong> {managerData?.emergencyContact?.relationship}</p>
            <p><strong>Phone:</strong> {managerData?.emergencyContact?.phone}</p>
          </div>
          <div className="rooms-info">
            <h4>Rooms Information</h4>
            {roomsData.map(room => (
              <p key={room.id}><strong>Room {room.name}:</strong> ${room.price} - {room.availability ? "Available" : "Occupied"}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DormManager;
