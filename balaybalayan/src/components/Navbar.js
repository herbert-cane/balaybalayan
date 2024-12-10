import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './nav.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // For handling profile dropdown
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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Check if the user is a dormer or manager
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

  return (
    <nav>
      <Link to="/" className="logo"> {/* Link to MainPage */}
        <img
          src={require('./photos/alt_logo.png')}
          alt="Logo"
          style={{ height: '60px' }}
        />
      </Link>

      {/* Show the small logo only if the user is logged in */}
      {userProfile && getUserDashboardLink() && (
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
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        !isAuthPage && (
          <Link to="/login/dormer">
            <button className="login-btn">Login</button>
          </Link>
        )
      )}
    </nav>
  );
}

export default Navbar;