
// RequireAuth.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuth = ({ allowedRoles, redirectTo }) => {
  const isAuthenticated = useSelector(state => state.isLoggedin);
  const userType = useSelector(state => state.userType);



  // Check if user is authenticated and has the allowed role
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    // Redirect to a different page if user role is not allowed
    return <Navigate to= {`${redirectTo}`} />;
  }

  // Render the outlet (child routes)
  return <Outlet />;
};

export default RequireAuth;