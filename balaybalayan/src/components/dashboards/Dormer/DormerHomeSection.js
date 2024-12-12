import React, { useState, useEffect } from "react";
import "./DormerHomeSection.css";
import { db } from "../../../firebase";
import { doc, getDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { auth } from "../../../firebase";

// Import all the components
import DormitoryInfo from "./homeComponents/DormitoryInfo";
import Announcements from "./homeComponents/Announcements";
import UpcomingEvents from "./homeComponents/UpcomingEvents";
import ManagerInfo from "./homeComponents/ManagerInfo";
import RequestModal from "./homeComponents/RequestModal";
import RequestButton from "./homeComponents/RequestButton";

const HomeSection = () => {
  const [dormInfo, setDormInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  
  // Request modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState("");

  // Fetch dormitory details
  useEffect(() => {
    const fetchDormitoryDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().dormitoryId) {
            const dormitoryId = userDoc.data().dormitoryId;

            const dormDoc = await getDoc(doc(db, "dormitories", dormitoryId));
            if (dormDoc.exists()) {
              setDormInfo(dormDoc.data());
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dormitory details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDormitoryDetails();
  }, []);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().dormitoryId) {
          const dormitoryId = userDoc.data().dormitoryId;
          const announcementsRef = collection(
            db,
            "dormitories",
            dormitoryId,
            "announcements"
          );

          const unsubscribe = onSnapshot(announcementsRef, (snapshot) => {
            const fetchedAnnouncements = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setAnnouncements(fetchedAnnouncements);
          });

          return () => unsubscribe();
        }
      }
    };

    fetchAnnouncements();
  }, []);

  // Fetch important dates
  useEffect(() => {
    const fetchImportantDates = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().dormitoryId) {
          const dormitoryId = userDoc.data().dormitoryId;
          const datesRef = collection(db, "dormitories", dormitoryId, "importantDates");

          const unsubscribe = onSnapshot(datesRef, (snapshot) => {
            const fetchedDates = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setImportantDates(fetchedDates);
          });

          return () => unsubscribe();
        }
      }
    };

    fetchImportantDates();
  }, []);

  // Fetch manager info
  useEffect(() => {
    const fetchManagerInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().dormitoryId) {
          const dormitoryId = userDoc.data().dormitoryId;

          const managersRef = collection(db, "users");
          const q = query(
            managersRef,
            where("dormitoryId", "==", dormitoryId),
            where("role", "==", "manager")
          );
          onSnapshot(q, (snapshot) => {
            const manager = snapshot.docs[0]?.data();
            if (manager) {
              setDormInfo((prev) => ({ ...prev, ...manager }));
            }
          });
        }
      }
    };

    fetchManagerInfo();
  }, []);

  // Handle request button click
  const handleRequestClick = (type) => {
    setSelectedRequestType(type);
    setIsRequestModalOpen(true);
  };

  // Handle request modal close
  const handleRequestModalClose = () => {
    setIsRequestModalOpen(false);
    setSelectedRequestType("");
  };

  if (loading) {
    return <div className="loading">Loading dormitory information...</div>;
  }

  if (!dormInfo) {
    return <div className="error">Unable to load dormitory information.</div>;
  }

  return (
    <div className="home-container">
      {/* Dormitory Info */}
      <DormitoryInfo dormInfo={dormInfo} />

      {/* Announcements */}
      <Announcements announcements={announcements} />

      {/* Upcoming Events */}
      <UpcomingEvents importantDates={importantDates} />

      {/* Manager Info and Request Section */}
      <div className="manager-request-container">
        {/* Manager Info */}
        <ManagerInfo dormInfo={dormInfo} />

        {/* Request/Report Block */}
        <div className="request-report">
          <h2 className="section-title">Request or Report</h2>
          <div className="request-options">
            <RequestButton 
              type="Drinking Water" 
              onClick={handleRequestClick} 
            />
            <RequestButton 
              type="WiFi" 
              onClick={handleRequestClick} 
            />
            <RequestButton 
              type="Laundry" 
              onClick={handleRequestClick} 
            />
            <RequestButton 
              type="Maintenance" 
              onClick={handleRequestClick} 
            />
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        selectedRequestType={selectedRequestType}
        isOpen={isRequestModalOpen}
        onClose={handleRequestModalClose}
      />
    </div>
  );
};

export default HomeSection;