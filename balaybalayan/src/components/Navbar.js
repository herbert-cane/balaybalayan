import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './nav.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Check if the current location is the starting page (e.g., "/")
  const isHomePage = location.pathname === '/';

  // Check if the current location is one of the auth-related paths
  const isAuthPage =
    location.pathname === '/login/dormer' ||
    location.pathname === '/signup/dormer' ||
    location.pathname === '/signup/manager' ||
    location.pathname === '/signup';

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

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const closeDropdown = () => setDropdownOpen(false);

  const getUserDashboardLink = () => {
    if (userProfile) {
      if (userProfile.role === 'dormer') {
        return '/dormers';
      } else if (userProfile.role === 'manager') {
        return '/dorm-manager';
      }
    }
    return null;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-actions')) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={isAuthPage ? 'auth-page' : ''}>
      {/* Only show logo and other components if the user is logged in or on other pages */}
      <Link to="/" className="logo">
        <img
          src={require('./photos/alt_logo.png')}
          alt="Desktop Logo"
          className="logo-desktop"
        />
        <img
          src={require('./photos/fav_icon.png')}
          alt="Mobile Logo"
          className="logo-mobile"
        />
      </Link>

      {user && userProfile && getUserDashboardLink() && (
        <Link to={getUserDashboardLink()} className="dashboard-button">
          <img
            src={require('./photos/small_logo.png')}
            alt="Logo"
            style={{ height: '40px' }}
          />
        </Link>
      )}

      {user ? (
        <div className="user-actions">
          <button onClick={toggleDropdown}>
            {userProfile ? userProfile.firstName : 'Loading...'}
          </button>
          <div className={`dropdown ${dropdownOpen ? 'show' : ''}`}>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      ) : (
        // Only show login button if on the home page and the user is not logged in
        isHomePage && !user && (
          <Link to="/login/dormer">
            <button
              className="login-btn"
              style={{
                backgroundColor: '#ffffff',
                color: '#344EAD',
                padding: '8px 15px',
                border: '1px solid #ddd',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
              }}
            >Login</button>
          </Link>
        )
      )}
    </nav>
  );
}

export default Navbar;
