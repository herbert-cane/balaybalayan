import React, { useState, useEffect } from "react";
import "./DormerHomeSection.css";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase";

const HomeSection = () => {
  const [dormInfo, setDormInfo] = useState(null); // Store dormitory details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDormitoryDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch the user's dormitoryId
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().dormitoryId) {
            const dormitoryId = userDoc.data().dormitoryId;

            // Fetch dormitory details
            const dormDoc = await getDoc(doc(db, "dormitories", dormitoryId));
            if (dormDoc.exists()) {
              setDormInfo(dormDoc.data());
            } else {
              console.error("Dormitory not found.");
            }
          } else {
            console.error("User or dormitory information is missing.");
          }
        } else {
          console.error("User is not logged in.");
        }
      } catch (error) {
        console.error("Error fetching dormitory details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDormitoryDetails();
  }, []); // Runs only once when the component mounts

  if (loading) {
    return <div className="loading">Loading dormitory information...</div>;
  }

  if (!dormInfo) {
    return <div className="error">Unable to load dormitory information.</div>;
  }

  return (
    <div className="home-container">
      {/* First Section - Dormitory Info */}
      <div className="dorm-info">
        <img
          src={dormInfo.dormPhoto || "placeholder-image.jpg"}
          alt="Dormitory"
          className="dorm-image"
        />
        <h2 className="dorm-name">{dormInfo.dormName}</h2>
        <p className="dorm-address">{dormInfo.dormAddress}</p>
        <p className="dorm-details">
          {dormInfo.priceRange} | {dormInfo.isVisitors ? "Visitors Allowed" : "No Visitors Allowed"} | Curfew: {dormInfo.curfew || "N/A"}
        </p>
      </div>

      {/* Second Section - Announcements */}
      <div className="announcements">
        <h2 className="section-title">Announcements</h2>
        <div className="announcement-content">
          {/* Placeholder for announcements */}
          <p>No announcements at this time.</p>
        </div>
      </div>

      {/* Third Section - Upcoming Events */}
      <div className="upcoming-events">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-content">
          {/* Placeholder for events */}
          <p>No events scheduled.</p>
        </div>
      </div>

      {/* Fourth Section - Manager Info and Request/Report */}
      <div className="manager-request-container">
        {/* Manager Info Block */}
        <div className="manager-info">
          <div className="manager-card">
            <div className="manager-left">
              <img
                src={dormInfo.managerPhoto || "placeholder-manager.jpg"}
                alt="Dorm Manager"
                className="manager-photo"
              />
              <h3 className="manager-name">{dormInfo.managers || "Unknown Manager"}</h3>
              <p className="manager-title">Dorm Manager</p>
            </div>
            <div className="manager-right">
              <h4>Contact Information</h4>
              <p>
                <span className="icon phone-icon" /> {dormInfo.managerPhone || "N/A"}
              </p>
              <p>
                <span className="icon email-icon" /> {dormInfo.managerEmail || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Request/Report Block */}
        <div className="request-report">
          <h2 className="section-title">Request or Report</h2>
          <div className="request-options">
            <button className="request-option">Drinking Water</button>
            <button className="request-option">WiFi</button>
            <button className="request-option">Laundry</button>
            <button className="request-option">Maintenance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
