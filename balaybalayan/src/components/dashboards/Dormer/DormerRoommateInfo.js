import React, { useState, useEffect } from "react";
import "./DormerRoommateInfo.css"; // Import the CSS file
import { db } from "../../../firebase"; // Adjust the import path if needed
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; // Firestore functions
import { auth } from "../../../firebase"; // For authentication

const DormitoryRoommateInfo = () => {
  const [roomInfo, setRoomInfo] = useState(null); // Store the user's room data
  const [roommates, setRoommates] = useState([]); // Store roommate information
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchRoommateInfo = async () => {
      try {
        const user = auth.currentUser; // Get current logged-in user
        if (!user) {
          throw new Error("User is not logged in.");
        }

        // Fetch the user's document
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData = userDocSnap.data();
        const { dormitoryId } = userData;

        if (!dormitoryId) {
          throw new Error("User is not assigned to a dormitory.");
        }

        // Fetch the room the user is assigned to
        const roomsRef = collection(db, `dormitories/${dormitoryId}/rooms`);
        const roomQuery = query(roomsRef, where("dormers", "array-contains", user.uid));
        const roomQuerySnapshot = await getDocs(roomQuery);

        if (roomQuerySnapshot.empty) {
          throw new Error("User is not assigned to any room in the dormitory.");
        }

        const userRoomDoc = roomQuerySnapshot.docs[0]; // Get the first matching room document
        const userRoomData = userRoomDoc.data(); // Room data
        const roomID = userRoomDoc.id; // Room ID

        setRoomInfo({ id: roomID, ...userRoomData }); // Store room information in state

        // Fetch roommate information
        const dormerIds = userRoomData.dormers.filter((dormerId) => dormerId !== user.uid); // Exclude the current user

        if (dormerIds.length > 0) {
          const dormersQuery = query(collection(db, "users"), where("__name__", "in", dormerIds));
          const dormersSnapshot = await getDocs(dormersQuery);

          const roommateData = dormersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setRoommates(roommateData); // Store roommate information in state
        } else {
          setRoommates([]); // No roommates
        }
      } catch (error) {
        console.error("Error fetching room or roommate information:", error);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchRoommateInfo();
  }, []);

  if (loading) {
    return <div className="loading">Loading roommate information...</div>;
  }

  if (!roomInfo) {
    return <div className="error">You are not assigned to a room. Please contact your Dorm Manager.</div>;
  }

  return (
    <div className="roommate-info-container">
      <h2>Your Room Information</h2>
      <div className="info-section">
        <h3>Room Details</h3>
        <p><strong>Room Name:</strong> {roomInfo.name || "N/A"}</p>
        <p><strong>Status:</strong> {roomInfo.status || "N/A"}</p>
        <p><strong>Max Occupants:</strong> {roomInfo.maxOccupants || "N/A"}</p>
        <p><strong>Price:</strong> {roomInfo.price || "N/A"}</p>
        <p><strong>Size:</strong> {roomInfo.size || "N/A"}</p>
        <p><strong>Amenities:</strong> {roomInfo.amenities || "N/A"}</p>
      </div>

      <div className="info-section">
        <h3>Your Roommates</h3>
        {roommates.length > 0 ? (
          roommates.map((roommate) => (
            <div key={roommate.id} className="roommate-card">
              <h4>{roommate.firstName} {roommate.lastName}</h4>
              <p><strong>Email:</strong> {roommate.email}</p>
              <p><strong>Address:</strong> {roommate.address || "N/A"}</p>
            </div>
          ))
        ) : (
          <p>No roommates assigned to your room.</p>
        )}
      </div>
    </div>
  );
};

export default DormitoryRoommateInfo;
