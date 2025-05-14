import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { RootState } from '../store/store';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: 'ADMIN' | 'USER' | 'MANTAINER';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, roles } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?redirectUrl=${redirectUrl}`} replace />;
  }

  if (requiredRole && roles) {
    const isvalidRol = roles.some((rol) => rol === requiredRole);
    if (!isvalidRol) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
};

export default PrivateRoute;
