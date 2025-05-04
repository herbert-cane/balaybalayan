import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc} from '@firebase/firestore';
import { getAuth } from 'firebase/auth';

import DormNavBar from './DormManagerNavBar';
import Overview from './Overview';
import Requests from './Requests';
import Rooms from './Rooms';
import MyDormers from './MyDormers';
import './FullScreenToggle.css';
import './dorm-manager-styles.css';

const getDormitoryId = async () => {
  const user = getAuth().currentUser;  // Get the current logged-in user
  if (user) {
    // Get the user's document from Firestore (assuming it's stored in 'users' collection)
    const userDoc = await getDoc(doc(db, 'users', user.uid));  // Get document by UID
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.dormitoryId; // Return the dormitoryId of the logged-in user
    }
  }
  return null; // Return null if user is not logged in or doesn't have dormitoryId
};

const DormManager = () => {
  const [activeSection, setActiveSection] = useState('overview'); // Default to 'Overview'
  const [dormitoryId, setDormitoryId] = useState(null); // State to hold dormitoryId

  useEffect(() => {
    const fetchDormitoryId = async () => {
      const id = await getDormitoryId(); // Get the dormitoryId for the logged-in manager
      setDormitoryId(id);
    };

    fetchDormitoryId();
  }, []); // Runs only once when the component mounts

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'requests':
        return <Requests />;
      case 'rooms':
        return <Rooms />;
      case 'dormers':
        return dormitoryId ? <MyDormers dormitoryId={dormitoryId} /> : <div>Loading...</div>;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="main-layout">
      <DormNavBar setSection={setActiveSection} activeSection={activeSection} />
      <div className="section-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default DormManager;
