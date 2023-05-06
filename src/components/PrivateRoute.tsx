import { getUser } from '@/services/user';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const user = getUser();
  return user !== null ? <Outlet /> : <Navigate to='/login' replace />;
}
