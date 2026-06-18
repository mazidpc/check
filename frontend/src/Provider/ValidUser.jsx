import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router';
import Loader from '../Components/Loader/Loader';

const ValidUser = ({ children }) => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('ValidUser must be used within AuthProvider');
  }

  const { user, isLoading } = authContext;
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    return children;
  }

  return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
};

export default ValidUser;