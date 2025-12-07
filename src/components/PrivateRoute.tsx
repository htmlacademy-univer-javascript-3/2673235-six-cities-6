import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { AuthorizationStatus } from '../store/const';
import Spinner from './Spinner';

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus,
  );

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return children;
  }

  return <Navigate to="/login" replace />;
}
