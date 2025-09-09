import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenNullOrExpired } from '../../lib/utils';

interface ProtectedRouteProps {
  children: JSX.Element,
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (isTokenNullOrExpired()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;