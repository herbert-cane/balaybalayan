import React from 'react';
import { useAuth } from '../AuthContext'; 
import { Link } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth(); 

  return (
    <nav>
      <h1>balay-balayan</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button> 
        </>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <Link to="/login/dormer">
            <button style={{ marginRight: '10px' }}>Login</button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
