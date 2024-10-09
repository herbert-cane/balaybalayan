import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

//add loading spinner LATERRRR
  if (loading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/" replace />; 
  }

  if (!allowedRoles.includes(role)) {
    if (role === 'manager') {
      return <Navigate to="/dorm-manager" replace />;
    }
    else if (role === 'dormer') {
        return <Navigate to="/dormers" replace />;
      }
    return <Navigate to="/" replace />; 
  }

  return children; 
};

export default ProtectedRoute;
