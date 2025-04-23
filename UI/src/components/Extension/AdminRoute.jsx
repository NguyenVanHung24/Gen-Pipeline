import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const { isSignedIn, isAdmin, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    toast.error('Please login to access this page');
    return <Navigate to="/blog/login" />;
  }

  if (!isAdmin) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/blog" />;
  }

  return children;
};

export default AdminRoute; 