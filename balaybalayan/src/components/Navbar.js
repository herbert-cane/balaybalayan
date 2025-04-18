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
    <nav className={`navbar ${isAuthPage ? 'auth-page' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left"></div> {/* Empty div for flex spacing */}
        <div className="navbar-center">
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
        </div>

        <div className="navbar-right">
          {user && userProfile && getUserDashboardLink() && (
            <Link to={getUserDashboardLink()} className="dashboard-link">
              <img
                src={require('./photos/small_logo.png')}
                alt="Dashboard"
                className="dashboard-icon"
              />
              <span>Dashboard</span>
            </Link>
          )}

          {user ? (
            <div className="user-actions">
              <button className="user-profile-button" onClick={toggleDropdown}>
                {userProfile?.profilePhotoURL ? (
                  <img 
                    src={userProfile.profilePhotoURL} 
                    alt="Profile" 
                    className="profile-photo"
                  />
                ) : (
                  <div className="profile-initial">
                    {userProfile?.firstName?.[0]?.toUpperCase()}
                  </div>
                )}
                <span>{userProfile ? userProfile.firstName : 'Loading...'}</span>
              </button>
              <div className={`dropdown ${dropdownOpen ? 'show' : ''}`}>
                <button className="dropdown-item" onClick={logout}>
                  <span className="icon">👋</span>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            isHomePage && !user && (
              <div className="auth-buttons">
                <Link to="/login/dormer" className="auth-button login">
                  Login
                </Link>
                <Link to="/signup" className="auth-button signup">
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
