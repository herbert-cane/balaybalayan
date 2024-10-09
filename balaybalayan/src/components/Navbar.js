import React from 'react';
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation for route checking
import './nav.css';  // Import the CSS

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();  // Get the current route

  // Check if the current route is one of the login or signup pages
  const isAuthPage = 
    location.pathname === '/login/dormer' || 
    location.pathname === '/login/manager' ||
    location.pathname === '/signup/dormer' ||
    location.pathname === '/signup/manager';

  return (
    <nav>
      {/* Conditionally render the logo based on the route */}
      {isAuthPage ? (
        <img src={require('./photos/logo4.png')} alt="Logo" style={{ display: 'block', margin: '0 auto', height: '75px' }} />
      ) : (
        <img src={require('./photos/logo2.png')} alt="Logo" />
      )}
      
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        // Conditionally render the login button based on the route
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
