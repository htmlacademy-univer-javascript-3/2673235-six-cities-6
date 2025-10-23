import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

type PrivateRouteProps = {
  isAuthorized: boolean;
  children: ReactNode;
};

export default function PrivateRoute({ isAuthorized, children }: PrivateRouteProps) {
  return isAuthorized ? children : <Navigate to="/login" replace />;
}
