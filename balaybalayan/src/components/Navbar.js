import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom'; 
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import './nav.css';  

function Navbar() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null); 
  const location = useLocation(); 

  const isAuthPage = 
    location.pathname === '/login/dormer' || 
    location.pathname === '/login/manager' ||
    location.pathname === '/signup/dormer' ||
    location.pathname === '/signup/manager';

  useEffect(() => {
    if (user && user.uid) {
      const fetchUserProfile = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid); 
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data()); 
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]); 

  return (
    <nav>
      {isAuthPage ? (
        <img src={require('./photos/logo4.png')} alt="Logo" style={{ display: 'block', margin: '0 auto', height: '75px' }} />
      ) : (
        <img src={require('./photos/logo2.png')} alt="Logo" />
      )}
      
      {user ? (
        <>
          <p>Welcome, {userProfile ? userProfile.firstName : 'Loading...'}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        !isAuthPage && (
            <Link to="/login/dormer">
              <button style={{ marginRight: '15px' }}>Login</button>
            </Link>
        )
      )}
    </nav>
  );
}

export default Navbar;
