import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router';
import Loader from '../Components/Loader/Loader';

const AdminCr = ({ children }) => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('AdminCr must be used within AuthProvider');
  }

  const { isLoading, user } = authContext;
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (user?.role === 'admin' || user?.role === 'cr') {
    return children;
  }

  return <Navigate to="/" state={{ from: location.pathname }} replace />;
};

export default AdminCr;