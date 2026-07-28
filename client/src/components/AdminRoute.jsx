import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader fullScreen />
      </div>
    );
  }

  // Redirect to login if user not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if user is not an admin
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children routes if authenticated and is admin
  return <Outlet />;
};

export default AdminRoute;
