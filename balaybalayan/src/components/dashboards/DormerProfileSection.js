import './DormerProfileSection.css'; // Import the CSS file
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';  // Make sure this is properly imported
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase'; // Import Firebase Auth

// Profile Section Component
const Profile = () => {
  // State to manage user data
  const [userData, setUserData] = useState({
    firstName: '',
    email: '',
    address: '',
    lastName:'',
    profilePhotoURL: '',
    coverPhoto: 'https://via.placeholder.com/1200x400', // Dummy Cover Photo URL
  });

  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true); // State to track loading status

  // Dummy data for tabs
  const tabData = {
    posts: ['Post 1: Just moved in!', 'Post 2: Loving the dorm life!'],
    friends: ['John Doe', 'Alice Smith', 'Bob Johnson'],
    photos: ['https://www.w3schools.com/w3images/avatar2.png', 'https://www.w3schools.com/w3images/forest.jpg'],
    settings: ['Change Email', 'Change Password', 'Privacy Settings'],
  };

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Fetch user data from Firestore
  const fetchUserData = (userId) => {
    const userRef = doc(db, 'users', userId); // Correct reference for Firestore
    getDoc(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            address: data.address || '',
            profilePhotoURL: data.profilePhotoURL || '',
            coverPhoto: data.coverPhoto || 'https://via.placeholder.com/1200x400', // Fallback to dummy
          });
          setLoading(false); // Data fetched, set loading to false
        } else {
          console.log('No user data available');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data: ', error);
        setLoading(false);
      });
  };

  // Listen for user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        fetchUserData(user.uid); // Fetch user data if logged in
      } else {
        console.log('User is not logged in');
        setLoading(false);
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // If data is still loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="cover-photo-container">
          <img src={userData.coverPhoto} alt="Cover" className="cover-photo" />
        </div>
        <div className="profile-info-container">
          <div className="profile-photo-container">
            <img
              src={userData.profilePhotoURL}
              alt="Profile"
              className="profile-photo"
            />
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{userData.firstName} {userData.lastName}</h2>
            <p className="profile-email">{userData.email}</p>
            <p className="profile-address">{userData.address}</p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabClick('posts')}
        >
          Posts
        </button>
        <button
          className={`profile-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => handleTabClick('friends')}
        >
          Friends
        </button>
        <button
          className={`profile-tab ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => handleTabClick('photos')}
        >
          Photos
        </button>
        <button
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabClick('settings')}
        >
          Settings
        </button>
      </div>

      {/* Display Content based on active tab */}
      <div className="profile-tab-content">
        {activeTab === 'posts' && (
          <div className="posts-content">
            {tabData.posts.map((post, index) => (
              <p key={index}>{post}</p>
            ))}
          </div>
        )}
        {activeTab === 'friends' && (
          <div className="friends-content">
            {tabData.friends.map((friend, index) => (
              <p key={index}>{friend}</p>
            ))}
          </div>
        )}
        {activeTab === 'photos' && (
          <div className="photos-content">
            {tabData.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Photo ${index}`} className="photo-item" />
            ))}
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="settings-content">
            {tabData.settings.map((setting, index) => (
              <p key={index}>{setting}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
