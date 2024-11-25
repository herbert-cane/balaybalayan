import React, { useState, useEffect } from "react";
import "./DormerAccountInfo.css"; // Import the CSS file
import { db } from "../../firebase"; // Adjust the import path if needed
import { doc, getDoc } from "firebase/firestore"; // For fetching data from Firestore
import { auth } from "../../firebase"; // For authentication

const AccountInformation = () => {
  const [accountInfo, setAccountInfo] = useState(null); // State to store user account data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const user = auth.currentUser; // Get current logged-in user
        if (user) {
          const docRef = doc(db, "users", user.uid); // Fetch user document
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setAccountInfo(docSnap.data());
          } else {
            console.error("No account information found!");
          }
        } else {
          console.error("User is not logged in.");
        }
      } catch (error) {
        console.error("Error fetching account information:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchAccountInfo();
  }, []);

  if (loading) {
    return <div className="loading">Loading account information...</div>;
  }

  if (!accountInfo) {
    return <div className="error">Unable to load account information.</div>;
  }

  return (
    <div className="account-info-container">
      <h2>Account Information</h2>
      <div className="info-section">
        <h3>Personal Details</h3>
        <p><strong>Name:</strong> {accountInfo.firstName} {accountInfo.lastName}</p>
        <p><strong>Email:</strong> {accountInfo.email}</p>
        <p><strong>Address:</strong> {accountInfo.address || "N/A"}</p>
      </div>

      <div className="info-section">
        <h3>Dormitory Details</h3>
        {accountInfo.dormitory ? (
          <>
            <p><strong>Dorm Name:</strong> {accountInfo.dormitory.name}</p>
            <p><strong>Address:</strong> {accountInfo.dormitory.address}</p>
            <p><strong>Price Range:</strong> {accountInfo.dormitory.priceRange}</p>
          </>
        ) : (
          <p>No dormitory information available.</p>
        )}
      </div>

      <div className="info-section">
        <h3>Settings</h3>
        <button className="edit-button">Edit Information</button>
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default AccountInformation;